import type { Colord } from 'colord'
import type { Alias } from '../primitives/attach'
export interface RawRange {
  name: string
  background: Colord
  shades: Colord[]
  foreground: Colord
}

export interface FormatedRange {
  name: string
  background: string
  shades: string[]
  foreground: string
}

export interface UmbraOutput {
  input: UmbraInput
  adjusted: UmbraAdjusted
  generated: RawRange[]
}

interface Accent {
  name?: string
  color?: string
  shades?: (number | string)[]
  readability?: number
}

export interface UmbraScheme {
  background: string
  foreground: string
  accents: (Accent | string)[]
  custom?: {
    [key: string]: string | ((s: UmbraInput) => string)
  }
}

export interface UmbraInput {
  scheme: UmbraScheme
  settings: UmbraSettings
  inversed?: UmbraInput
}

export interface UmbraAdjusted {
  background: string
  foreground: string
  accents: (Accent | string)[]
  input: UmbraInput
}

export interface UmbraSettings {
  readability?: number
  iterations?: number
  aliases?: Alias | true
  shades?: (number | string)[]
  tints?: (number | string)[]
}
