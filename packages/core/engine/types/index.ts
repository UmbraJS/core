import type tinycolor from 'tinycolor2'
import type { Alias } from '../primitives/attach'

export interface RawRange {
  name: string
  background: tinycolor.Instance
  shades: tinycolor.Instance[]
  foreground: tinycolor.Instance
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
  ranges: RawRange[]
}

export type SchemeKey = 'foreground' | 'background' | 'accents' | string

export interface UmbraColors {
  colors: RawRange[]
  input: UmbraInput
  adjusted: UmbraAdjusted
}

type SubSchemes = {
  [key: string]: UmbraInput
}

export interface Accent {
  name?: string
  value: string
  shades?: Shade[]
  readability?: number
}

export interface AdjustedAccent {
  name?: string
  value: tinycolor.Instance
  shades?: Shade[]
  readability: number
}
export interface UmbraScheme {
  background: string
  foreground: string
  accents: (Accent | string)[]
  custom?: ColorList
  subSchemes?: SubSchemes
}

export interface UmbraInput {
  scheme: UmbraScheme
  settings: UmbraSettings
  inversed?: UmbraInput
}

export interface UmbraAdjusted {
  background: tinycolor.Instance
  foreground: tinycolor.Instance
  accents: AdjustedAccent[]
  subSchemes?: SubSchemes
  input: UmbraInput
}

export type CustomColor = string | ((s: UmbraInput) => string)

export interface ColorList {
  [key: string]: CustomColor
}

export type Shade = number | string

export interface SettingType {
  shade?: Shade[]
}

export interface UmbraSettings {
  readability?: number
  iterations?: number
  foreground?: SettingType
  background?: SettingType
  accents?: SettingType
  aliases?: Alias | true
  shades?: Shade[]
}
