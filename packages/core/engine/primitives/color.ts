import { colord, Colord, extend } from 'colord'
import mixPlugin from 'colord/plugins/mix'
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { UmbraAdjusted } from '../types'
import { settings } from '../defaults'

extend([mixPlugin])

type ColorRawRange = {
  foreground: string | Colord
  background: string | Colord
  readability?: number
  iterations?: number
}

interface IncreaseContrastUntil {
  color: Colord
  contrast?: Colord
  iterations?: number
  condition: (newColor: Colord, iterations?: number) => boolean
}

interface MoveAwayFrom {
  color: Colord
  contrast?: Colord
  val: number
}

const stored = {
  readability: settings.readability || 11,
  iterations: settings.iterations || 15
}

function apcaContrast(fg: string | Colord, bg: string | Colord) {
  const fgc = colord(fg).toRgb()
  const bgc = colord(bg).toRgb()
  return APCAcontrast(sRGBtoY([fgc.r, fgc.g, fgc.b]), sRGBtoY([bgc.r, bgc.g, bgc.b]))
}

export const getReadability = (fg: string | Colord, bg: string | Colord) => {
  return apcaContrast(fg, bg)
}

export const getReadable = ({ foreground, background, readability, iterations }: ColorRawRange) => {
  const color = colord(foreground)
  const contrast = colord(background)
  return increaseContrastUntil({
    color,
    contrast,
    iterations: iterations || stored.iterations,
    condition: (c) => {
      const current = Math.abs(getReadability(c, background))
      return current > (readability || stored.readability)
    }
  })
}

export function increaseContrastUntil({
  color,
  contrast,
  condition,
  iterations = 15
}: IncreaseContrastUntil) {
  let newColor = color
  let count = 0
  while (!condition(newColor, count) && count < iterations) {
    count += 1
    newColor = increaseContrast({
      val: iterations,
      color: newColor,
      contrast
    })
  }
  return newColor
}

const increaseContrast = ({ color, contrast, val = 100 }: MoveAwayFrom) => {
  const same = contrast ? color.isDark() === contrast.isDark() : true
  return same
    ? color.isDark()
      ? color.lighten(val)
      : color.darken(val)
    : contrast?.isDark()
    ? color.lighten(val)
    : color.darken(val)
}

export function mostReadable(color: string, colors: string[]) {
  const readable = colors.map((c) => Math.abs(getReadability(color, c)))
  const index = readable.indexOf(Math.max(...readable))
  return colors[index]
}

export const pickContrast = (color: string, scheme: UmbraAdjusted) => {
  return mostReadable(color, [scheme.background || 'white', scheme.foreground || 'black'])
}

export function colorMix(from: string | Colord, to: string | Colord, percent = 50) {
  const tinyFrom = colord(from)
  const tinyTo = colord(to)
  return colord(tinyFrom).mix(tinyTo, percent / 100)
}
