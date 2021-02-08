import {
  GlyphClass, GlyphId, LineMetrics, NameRecord, Rect, ScriptMetrics, TableName, VariationAxis,
} from './types';

export type FontsInCollection = (data: Uint8Array) => number | null;

export interface FaceInterface {
  hasTable(name: TableName): boolean;
  names(): NameRecord[];
  isRegular(): boolean;
  isItalic(): boolean;
  isBold(): boolean;
  isOblique(): boolean;
  isMonospaced(): boolean;
  isVariable(): boolean;
  weight(): number;
  width(): number;
  italicAngle(): number | null;
  ascender(): number;
  descender(): number;
  height(): number;
  lineGap(): number;
  typographicAscender(): number | null;
  typographicDescender(): number | null;
  typographicLineGap(): number | null;
  verticalAscender(): number | null;
  verticalDescender(): number | null;
  verticalHeight(): number | null;
  verticalLineGap(): number | null;
  unitsPerEm(): number | null;
  xHeight(): number | null;
  capitalHeight(): number | null;
  underlineMetrics(): LineMetrics | null;
  strikeoutMetrics(): LineMetrics | null;
  subscriptMetrics(): ScriptMetrics | null;
  superscriptMetrics(): ScriptMetrics | null;
  numberOfGlyphs(): number;
  glyphIndex(char: string): GlyphId | null;
  glyphVariationIndex(char: string, variation: string): GlyphId | null;
  glyphHorAdvance(glyphId: GlyphId): number | null;
  glyphVerAdvance(glyphId: GlyphId): number | null;
  glyphHorSideBearing(glyphId: GlyphId): number | null;
  glyphVerSideBearing(glyphId: GlyphId): number | null;
  glyphYOrigin(glyphId: GlyphId): number | null;
  glyphName(glyphId: GlyphId): Uint8Array | null;
  glyphClass(glyphId: GlyphId): GlyphClass | null;
  glyphMarkAttachmentClass(glyphId: GlyphId): number;
  isMarkGlyph(glyphId: GlyphId): boolean;
  glyphBoundingBox(glyphId: GlyphId): Rect | null;
  variationAxes(): VariationAxis[];
}

export type FaceCache = Partial<{
  hasTable: Partial<Record<TableName, boolean>>;
  names: NameRecord[];
  isRegular: boolean;
  isItalic: boolean;
  isBold: boolean;
  isOblique: boolean;
  isMonospaced: boolean;
  isVariable: boolean;
  weight: number;
  width: number;
  italicAngle: number | null;
  ascender: number;
  descender: number;
  height: number;
  lineGap: number;
  typographicAscender: number | null;
  typographicDescender: number | null;
  typographicLineGap: number | null;
  verticalAscender: number | null;
  verticalDescender: number | null;
  verticalHeight: number | null;
  verticalLineGap: number | null;
  unitsPerEm: number | null;
  xHeight: number | null;
  capitalHeight: number | null;
  underlineMetrics: LineMetrics | null;
  strikeoutMetrics: LineMetrics | null;
  subscriptMetrics: ScriptMetrics | null;
  superscriptMetrics: ScriptMetrics | null;
  numberOfGlyphs: number;
  glyphIndex: Partial<Record<string, GlyphId | null>>;
  glyphVariationIndex: Partial<Record<string, GlyphId | null>>;
  glyphHorAdvance: Partial<Record<GlyphId, number | null>>;
  glyphVerAdvance: Partial<Record<GlyphId, number | null>>;
  glyphHorSideBearing: Partial<Record<GlyphId, number | null>>;
  glyphVerSideBearing: Partial<Record<GlyphId, number | null>>;
  glyphYOrigin: Partial<Record<GlyphId, number | null>>;
  glyphName: Partial<Record<GlyphId, Uint8Array | null>>;
  glyphClass: Partial<Record<GlyphId, GlyphClass | null>>;
  glyphMarkAttachmentClass: Partial<Record<GlyphId, number>>;
  isMarkGlyph: Partial<Record<GlyphId, boolean>>;
  glyphBoundingBox: Partial<Record<GlyphId, Rect | null>>;
  variationAxes: VariationAxis[];
}>;