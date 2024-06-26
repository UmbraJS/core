import { colord } from 'colord'
import { defaultSettings, defaultScheme } from './defaults'
import type { UmbraScheme, UmbraRange, UmbraSettings } from './types'

import { format } from './primitives/format'
import type { Formater, UmbraOutputs, AttachProps } from './primitives/format'
import { inverse, isDark } from './primitives/scheme'
import { getReadable } from './primitives/color'
import { umbraGenerate } from './generator'

import type { Alias } from './primitives/attach'

interface ApplyProps {
  formater?: Formater
  alias?: Alias | boolean
  target?: string | HTMLElement | null
}

interface Format extends UmbraOutputs {
  attach: (props: AttachProps) => UmbraOutputs
}

export interface Umbra {
  output: UmbraRange[]
  input: Partial<UmbraScheme>
  apply: (props?: ApplyProps) => UmbraOutputs
  format: (formater?: Formater) => Format
  isDark: () => boolean
  inverse: () => Umbra
}

export function umbra(scheme: Partial<UmbraScheme> = defaultScheme): Umbra {
  const input = insertFallbacks(scheme)
  const adjustment = umbraAdjust(input)
  return umbraHydrate({
    input,
    output: umbraGenerate(input, adjustment),
    inversed: input.inversed
  })
}

function insertFallbacks(scheme: Partial<UmbraScheme> = defaultScheme): UmbraScheme {
  const settingsFallback = {
    settings: {
      ...defaultSettings,
      ...scheme.settings
    },
    inversed: {
      ...defaultSettings,
      ...scheme.settings,
      ...scheme.inversed?.settings
    }
  }

  const inversed = scheme.inversed && {
    ...scheme.inversed,
    settings: settingsFallback.inversed
  }

  return {
    ...defaultScheme,
    ...scheme,
    settings: settingsFallback.settings,
    inversed: inversed
  }
}

function umbraAdjust(scheme = defaultScheme) {
  const background = colord(scheme.background)
  const foreground = getReadable({
    readability: scheme.settings?.readability || 4,
    iterations: scheme.settings?.iterations || 15,
    power: scheme.settings?.power || 15,
    foreground: colord(scheme.foreground),
    background
  })

  return {
    accents: scheme.accents,
    background,
    foreground
  }
}

function getTarget(target?: string | HTMLElement | null) {
  if (!target) return undefined
  const targetIsString = typeof target === 'string'
  const targetIsElement = target instanceof HTMLElement || target === null
  return {
    element: targetIsElement ? target : undefined,
    selector: targetIsString ? target : undefined
  }
}

export function umbraHydrate({
  input,
  output,
  inversed,
  settings
}: {
  input: UmbraScheme
  output: UmbraRange[]
  inversed?: UmbraScheme
  settings?: UmbraSettings
}) {
  function getFormat(passedFormater?: Formater) {
    const formater = passedFormater || settings?.formater
    return format({ output, formater, input, callback: settings?.callback })
  }

  return {
    input,
    output,
    isDark: () => isDark(input),
    format: (formater?: Formater) => getFormat(formater),
    inverse: () => umbra(inverse(input, inversed)) as Umbra,
    apply: (props?: ApplyProps) => {
      const { alias, formater } = props || {}
      const target = getTarget(props?.target)
      const formated = getFormat(formater)
      const outputs = formated.attach({ alias, target })
      settings?.callback && settings.callback(outputs)
      return outputs
    }
  }
}
