import { colord } from 'colord'
import { settings, defaultScheme } from './defaults'
import type { UmbraOutput } from './types'

import { format, Format, Formater, UmbraOutputs } from './primitives/format'
import { inverse, isDark } from './primitives/scheme'
import type { Alias } from './primitives/attach'
import { getReadable } from './primitives/color'
import { umbraGenerate } from './generator'

interface ApplyProps {
  element?: HTMLElement
  formater?: Formater
  alias?: Alias | boolean
}

export interface Umbra {
  output: UmbraOutput
  apply: (props?: ApplyProps) => UmbraOutputs
  format: (formater?: Formater) => Format
  isDark: () => boolean
  inverse: () => Umbra
}

export function umbraHydrate(output: UmbraOutput) {
  const input = output.input
  function apply({ element, formater, alias }: ApplyProps = {}) {
    return format({ output, formater }).attach(element, alias)
  }

  return {
    output,
    apply,
    isDark: () => isDark(input),
    format: (formater?: Formater) => format({ output, formater }),
    inverse: () => umbra(inverse(input).scheme, input.settings)
  }
}

export function umbra(scheme = defaultScheme, passedSettings = settings) {
  const input = {
    scheme,
    settings: {
      ...settings,
      ...passedSettings
    }
  }

  const readability = input.settings.readability || 4
  const accents = scheme.accents || []
  const background = scheme.background //colord(scheme.background)
  const foreground = getReadable({
    foreground: colord(scheme.foreground),
    background,
    readability
  }).toHex()

  const adjusted = {
    input,
    background,
    foreground,
    accents
  }

  return umbraHydrate(umbraGenerate(adjusted))
}
