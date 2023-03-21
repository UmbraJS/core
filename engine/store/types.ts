import tinycolor from "tinycolor2"

export type DynamicObject = {[key: number]: string}

export interface GenColor {
  color: string;
  contrast: string;
  shade: DynamicObject;
}

export type SchemeKey = 'foreground' | 'background' | 'accents' | string

export interface MyriadOutputBasic {
  background?: GenColor,
  foreground?: GenColor,
  accents?: GenColor[],
} 

export interface MyriadOutput extends MyriadOutputBasic {
  origin: Myriad,
}

type subSchemes = {
  [key: string]: Myriad
}

export interface Myriad {
  background?: string,
  foreground?: string,
  accents?: string[],
  custom?: ColorList
  subSchemes?: subSchemes,
}

interface MyriadAdjusted {
  background?: tinycolor.Instance,
  foreground?: tinycolor.Instance,
  accents?: tinycolor.Instance[],
  subSchemes?: subSchemes,
}

export interface AdjustedScheme extends MyriadAdjusted {
  origin: Myriad,
}

export type customColor = string | ((s: Myriad) => string)
export interface ColorList {
  [key: string]: customColor
}