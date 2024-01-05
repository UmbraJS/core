import { colord, Colord } from 'colord'
import { UmbraAdjusted, UmbraInput } from './types'
import { pickContrast, colorMix } from './primitives/color'
import { normalizeRange, nextAccent, getStrings } from './primitives/utils'
import { defaultSettings } from './defaults'

interface GetRange {
  from: Colord
  to: Colord
  range: (number | string)[]
}

function getRange({ from, to, range }: GetRange) {
  const accents = getStrings(range)
  let lastColor = from
  let nextColor = accents.length > 0 ? colord(accents[0] as string) : to

  return range.map((val) => {
    if (typeof val === 'string') {
      const color = colord(val)
      lastColor = color
      accents.shift()
      return color
    } else {
      nextColor = nextAccent(accents, to)
      const newColor = colorMix(lastColor, nextColor, val as number)
      lastColor = newColor
      return newColor
    }
  })
}

function accentRange(
  input: UmbraInput,
  adjusted: UmbraAdjusted,
  passedRange: (number | string)[],
  color?: string
) {
  const { background, foreground } = adjusted
  const settingsRange = background.isDark() ? defaultSettings.shades : defaultSettings.tints
  const range = passedRange.length > 0 ? passedRange : settingsRange || []

  if (!color) return getRange({ from: background, to: foreground, range })

  const defaultRange = input.settings.shades || []
  const shades = getRange({ from: background, to: foreground, range: defaultRange })
  const normalizedRange = normalizeRange({ range: range, shades, color: colord(color) })
  return getRange({ from: background, to: foreground, range: normalizedRange })
}

function accents(input: UmbraInput, adjusted: UmbraAdjusted) {
  const defaultShades = rangeValues(adjusted, input.settings)
  return adjusted.accents.map((accent) => {
    const plainColor = typeof accent === 'string' ? accent : accent.color
    const plainRange = typeof accent === 'string' ? defaultShades : rangeValues(adjusted, accent)
    const color = plainColor ? plainColor : plainRange ? getStrings(plainRange)[0] : undefined
    const range = plainRange ? plainRange : defaultShades
    const name = typeof accent === 'string' ? undefined : accent.name

    const c = color ? colord(color) : undefined
    const fallback = c ? c : adjusted.foreground
    return {
      name: name ? name : `accent`,
      background: fallback,
      foreground: pickContrast(fallback, adjusted),
      shades: accentRange(input, adjusted, range, plainColor)
    }
  })
}

interface RangeValues {
  shades?: (number | string)[]
  tints?: (number | string)[]
}

function rangeValues(adjusted: UmbraAdjusted, scheme?: RangeValues) {
  const { background } = adjusted
  const shades = scheme?.shades || []
  const tints = scheme?.tints || shades
  return background.isDark() ? shades : tints
}

function base(input: UmbraInput, adjusted: UmbraAdjusted) {
  const { background, foreground } = adjusted
  const range = rangeValues(adjusted, input.settings)
  return {
    name: 'base',
    background,
    foreground,
    shades: getRange({ from: background, to: foreground, range })
  }
}

export function umbraGenerate(input: UmbraInput, adjusted: UmbraAdjusted) {
  return [base(input, adjusted), ...accents(input, adjusted)]
}
