import { UmbraAdjusted } from '../types'
import { settings } from '../store'
import tinycolor from 'tinycolor2'
import { calcAPCA } from 'apca-w3'

export type Color = tinycolor.Instance
export type Colour = string | Color

type ColorRawRange = {
  foreground: Colour
  background: Colour
  readability?: number
  iterations?: number
}

interface increaseContrastUntil {
  color: Color
  contrast?: Color
  max?: number
  condition: (newColor: tinycolor.Instance, iterations?: number) => boolean
}

interface MoveAwayFrom {
  color: Color
  contrast?: Color
  val: number
}

const stored = {
  readability: settings.readability || 11,
  iterations: settings.iterations || 15
}

type RGB = [number, number, number]

function APCAcolor(color: Colour): RGB {
  const rgba = tinycolor(color).toRgb()
  return [rgba.r, rgba.g, rgba.b]
}

//take fg. Compare it to black and white. the one with the highest contrast decides if we should lighten or darken it.
//keep adjusting till lc target is reached

//accent is middle out? At what point in the range is the accent the most like itself?

export function APCAcontrast(col: Colour, bg: Colour) {
  return calcAPCA(APCAcolor(col), APCAcolor(bg))
}

export const getReadability = (col: Colour, bg: Colour) => {
  //TODO: use APCA to calculate contrast
  // let contrastLc = APCAcontrast(col, bg)
  // console.log(contrastLc, tinycolor.readability(col, bg))
  return tinycolor.readability(col, bg)
}

export const getReadable = ({ foreground, background, readability, iterations }: ColorRawRange) => {
  const color = tinycolor(foreground)
  const contrast = tinycolor(background)
  const safeReadability = readability || stored.readability
  const max = iterations || stored.iterations
  return increaseContrastUntil({
    color,
    contrast,
    max,
    condition: (c) => {
      const current = getReadability(c, background)
      return current > safeReadability
    }
  })
}

export function increaseContrastUntil({
  color,
  contrast,
  condition,
  max = 15
}: increaseContrastUntil) {
  let newColor = color
  let iterations = 0
  while (!condition(newColor, iterations) && iterations < max) {
    iterations += 1
    newColor = increaseContrast({
      val: iterations,
      color: newColor,
      contrast
    })
  }
  return newColor
}

// function lightReverse(color: Color, val: number) {
//   return color?.isDark() ? color.lighten(val) : color.darken(val)
// }

// const increaseContrast = ({ color, contrast, val = 100 }: MoveAwayFrom) => {
//   const same = contrast ? color.isDark() === contrast.isDark() : true
//   return same ? lightReverse(color, val) : lightReverse(contrast || color, val)
// }

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

export const pickContrast = (c: Color, scheme: UmbraAdjusted) => {
  const color = c.clone()
  return tinycolor.mostReadable(color, [
    scheme.background || tinycolor('white'),
    scheme.foreground || tinycolor('black')
  ])
}

export function colorMix(from: Colour, to: Colour, percent = 50) {
  const tinyFrom = tinycolor(from)
  const tinyTo = tinycolor(to)
  return tinycolor.mix(tinyFrom, tinyTo, percent)
}
