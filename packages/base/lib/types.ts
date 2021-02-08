export const TableName = {
  AxisVariations: 0,
  CharacterToGlyphIndexMapping: 1,
  ColorBitmapData: 2,
  ColorBitmapLocation: 3,
  CompactFontFormat: 4,
  CompactFontFormat2: 5,
  FontVariations: 6,
  GlyphData: 7,
  GlyphDefinition: 8,
  GlyphVariations: 9,
  Header: 10,
  HorizontalHeader: 11,
  HorizontalMetrics: 12,
  HorizontalMetricsVariations: 13,
  IndexToLocation: 14,
  Kerning: 15,
  MaximumProfile: 16,
  MetricsVariations: 17,
  Naming: 18,
  PostScript: 19,
  ScalableVectorGraphics: 20,
  StandardBitmapGraphics: 21,
  VerticalHeader: 22,
  VerticalMetrics: 23,
  VerticalMetricsVariations: 24,
  VerticalOrigin: 25,
  WindowsMetrics: 26,
} as const;

export type TableName = keyof typeof TableName;

export const GlyphClass = {
  1: 'Base',
  2: 'Ligature',
  3: 'Mark',
  4: 'Component',
} as const;

export type GlyphClass = typeof GlyphClass[keyof typeof GlyphClass];

export type NameRecord = {
  platformId: number;
  encodingId: number;
  languageId: number;
  nameId: number;
  value: Uint8Array;
};

export type LineMetrics = {
  position: number;
  thickness: number;
};

export type ScriptMetrics = {
  xSize: number;
  ySize: number;
  xOffset: number;
  yOffset: number;
};

export type GlyphId = number;

export type Rect = {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
};

export type VariationAxis = {
  tag: number;
  minValue: number;
  defaultValue: number;
  maxValue: number;
  nameId: number;
  hidden: boolean;
};
