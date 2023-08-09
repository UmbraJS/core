import { umbra, umbraObject, subScheme, Umbra } from './engine/index'
import { randomUmbra, randomScheme } from './engine/primitives/utils'
import {
  format,
  FlattenColor,
  Formater,
  UmbraOutputs,
  hexFormat,
  rgbStrippedFormat,
  hslFormat
} from './engine/primitives/format'
import { attach } from './engine/primitives/attach'
import { getReadable, colorMix } from './engine/primitives/color'
import type {
  UmbraOutput,
  UmbraSettings,
  UmbraScheme,
  UmbraInput,
  RawRange,
  FormatedRange
} from './engine/types'
import { inverse, isDark, findContrast } from './engine/primitives/scheme'

export {
  umbra,
  umbraObject,
  subScheme,
  randomUmbra,
  randomScheme,
  getReadable,
  colorMix,
  isDark,
  inverse,
  findContrast,
  attach,
  format,
  hexFormat,
  rgbStrippedFormat,
  hslFormat
}

export type {
  Umbra,
  UmbraInput,
  UmbraScheme,
  UmbraSettings,
  UmbraOutput,
  UmbraOutputs,
  RawRange,
  FlattenColor,
  Formater,
  FormatedRange
}