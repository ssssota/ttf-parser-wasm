import { FaceCache, FontsInCollection, FaceInterface } from './interfaces';
import {
  GlyphClass, GlyphId, LineMetrics, NameRecord, Rect, ScriptMetrics, TableName, VariationAxis,
} from './types';
import { WasmBool, WasmExports } from './wasmexports';

const bool = (ret: WasmBool) => ret !== 0;
const nonNull = <T>(item: T | null | undefined): item is T => item != null;

export const createExport = (instance: WebAssembly.Instance): {
  fontsInCollection: FontsInCollection;
  Face: { new(data: Uint8Array, index: number): FaceInterface };
} => {
  const wasm = instance.exports as WasmExports;
  wasm.memory.grow(500);

  const fontsInCollection: FontsInCollection = (data: Uint8Array): number | null => {
    // eslint-disable-next-line no-underscore-dangle
    const heapStart = wasm.__heap_base.value as number;
    new Uint8Array(wasm.memory.buffer).set(data, heapStart);

    const result = wasm.ttfp_fonts_in_collection(heapStart, data.length);
    return (result === -1) ? null : result;
  };

  class Face implements FaceInterface {
    private static readonly FACE_SIZE = wasm.ttfp_face_size_of();

    private static readonly RECORD_LENGTH = 5; // u16

    private static readonly LINE_METRICS_LENGTH = 2; // i16

    private static readonly SCRIPT_METRICS_LENGTH = 4; // i16

    private static readonly GLYPH_NAME_LENGTH = 256; // char

    private static readonly RECT_LENGTH = 4; // i16

    private static readonly TAG_LENGTH = 1; // u32

    private static get heapStart(): number {
      // eslint-disable-next-line no-underscore-dangle
      return wasm.__heap_base.value;
    }

    private facePtr?: number;

    private cache: FaceCache = {};

    private data: Uint8Array

    private index: number

    private get freeptr(): number {
      return Face.heapStart + Face.FACE_SIZE + this.data.length;
    }

    constructor(
      data: Uint8Array,
      index: number,
    ) {
      this.data = data;
      this.index = index;
    }

    private init(): number {
      const { heapStart } = Face;
      this.facePtr = heapStart;
      const fontDataPtr = heapStart + Face.FACE_SIZE;
      new Uint8Array(wasm.memory.buffer).set(this.data, fontDataPtr);

      wasm.ttfp_face_init(fontDataPtr, this.data.length, this.index, this.facePtr);
      return this.facePtr;
    }

    hasTable(name: TableName): boolean {
      if (this.cache.hasTable === undefined) this.cache.hasTable = {};
      const cache = this.cache.hasTable[name];
      if (cache !== undefined) return cache;

      const face = this.init();
      const result = bool(wasm.ttfp_has_table(face, TableName[name]));
      this.cache.hasTable[name] = result;
      return result;
    }

    names(): NameRecord[] {
      if (this.cache.names !== undefined) return this.cache.names;
      const face = this.init();
      const num = wasm.ttfp_get_name_records_count(face);
      const result = Array(num).fill(0).map((_, i): NameRecord | undefined => {
        const recordPtr = this.freeptr;
        const record = new Uint16Array(wasm.memory.buffer, recordPtr, Face.RECORD_LENGTH);
        if (!wasm.ttfp_get_name_record(face, i, recordPtr)) return undefined;
        const namePtr = recordPtr + Face.RECORD_LENGTH * 2;
        const nameLength = record[4];
        const name = new Uint8Array(wasm.memory.buffer, namePtr, nameLength);
        if (!wasm.ttfp_get_name_record_string(face, i, namePtr, nameLength)) return undefined;

        return {
          platformId: record[0],
          encodingId: record[1],
          languageId: record[2],
          nameId: record[3],
          value: name.slice(),
        };
      }).filter(nonNull);
      this.cache.names = result;
      return result;
    }

    isRegular(): boolean {
      if (this.cache.isRegular !== undefined) return this.cache.isRegular;
      const face = this.init();
      const result = bool(wasm.ttfp_is_regular(face));
      this.cache.isRegular = result;
      return result;
    }

    isItalic(): boolean {
      if (this.cache.isItalic !== undefined) return this.cache.isItalic;
      const face = this.init();
      const result = bool(wasm.ttfp_is_italic(face));
      this.cache.isItalic = result;
      return result;
    }

    isBold(): boolean {
      if (this.cache.isBold !== undefined) return this.cache.isBold;
      const face = this.init();
      const result = bool(wasm.ttfp_is_bold(face));
      this.cache.isBold = result;
      return result;
    }

    isOblique(): boolean {
      if (this.cache.isOblique !== undefined) return this.cache.isOblique;
      const face = this.init();
      const result = bool(wasm.ttfp_is_oblique(face));
      this.cache.isOblique = result;
      return result;
    }

    isMonospaced(): boolean {
      if (this.cache.isMonospaced !== undefined) return this.cache.isMonospaced;
      const face = this.init();
      const result = bool(wasm.ttfp_is_monospaced(face));
      this.cache.isMonospaced = result;
      return result;
    }

    isVariable(): boolean {
      if (this.cache.isRegular !== undefined) return this.cache.isRegular;
      const face = this.init();
      const result = bool(wasm.ttfp_is_regular(face));
      this.cache.isRegular = result;
      return result;
    }

    weight(): number {
      if (this.cache.weight !== undefined) return this.cache.weight;
      const face = this.init();
      const result = wasm.ttfp_get_weight(face);
      this.cache.weight = result;
      return result;
    }

    width(): number {
      if (this.cache.width !== undefined) return this.cache.width;
      const face = this.init();
      const result = wasm.ttfp_get_width(face);
      this.cache.width = result;
      return result;
    }

    italicAngle(): number | null {
      if (this.cache.italicAngle !== undefined) return this.cache.italicAngle;
      const face = this.init();
      const result = wasm.ttfp_get_italic_angle(face);
      this.cache.italicAngle = (result === 0) ? null : result;
      return this.cache.italicAngle;
    }

    ascender(): number {
      if (this.cache.ascender !== undefined) return this.cache.ascender;
      const face = this.init();
      const result = wasm.ttfp_get_ascender(face);
      this.cache.ascender = result;
      return result;
    }

    descender(): number {
      if (this.cache.descender !== undefined) return this.cache.descender;
      const face = this.init();
      const result = wasm.ttfp_get_descender(face);
      this.cache.descender = result;
      return result;
    }

    height(): number {
      if (this.cache.height !== undefined) return this.cache.height;
      const face = this.init();
      const result = wasm.ttfp_get_height(face);
      this.cache.height = result;
      return result;
    }

    lineGap(): number {
      if (this.cache.lineGap !== undefined) return this.cache.lineGap;
      const face = this.init();
      const result = wasm.ttfp_get_line_gap(face);
      this.cache.lineGap = result;
      return result;
    }

    typographicAscender(): number | null {
      if (this.cache.typographicAscender !== undefined) return this.cache.typographicAscender;
      const face = this.init();
      const result = wasm.ttfp_get_typographic_ascender(face);
      this.cache.typographicAscender = result;
      return result;
    }

    typographicDescender(): number | null {
      if (this.cache.typographicDescender !== undefined) return this.cache.typographicDescender;
      const face = this.init();
      const result = wasm.ttfp_get_typographic_descender(face);
      this.cache.typographicDescender = (result === 0) ? null : result;
      return this.cache.typographicDescender;
    }

    typographicLineGap(): number | null {
      if (this.cache.typographicLineGap !== undefined) return this.cache.typographicLineGap;
      const face = this.init();
      const result = wasm.ttfp_get_typographic_line_gap(face);
      this.cache.typographicLineGap = (result === 0) ? null : result;
      return this.cache.typographicLineGap;
    }

    verticalAscender(): number | null {
      if (this.cache.verticalAscender !== undefined) return this.cache.verticalAscender;
      const face = this.init();
      const result = wasm.ttfp_get_vertical_ascender(face);
      this.cache.verticalAscender = (result === 0) ? null : result;
      return this.cache.verticalAscender;
    }

    verticalDescender(): number | null {
      if (this.cache.verticalDescender !== undefined) return this.cache.verticalDescender;
      const face = this.init();
      const result = wasm.ttfp_get_vertical_descender(face);
      this.cache.verticalDescender = (result === 0) ? null : result;
      return this.cache.verticalDescender;
    }

    verticalHeight(): number | null {
      if (this.cache.verticalHeight !== undefined) return this.cache.verticalHeight;
      const face = this.init();
      const result = wasm.ttfp_get_vertical_height(face);
      this.cache.verticalHeight = (result === 0) ? null : result;
      return this.cache.verticalHeight;
    }

    verticalLineGap(): number | null {
      if (this.cache.verticalLineGap !== undefined) return this.cache.verticalLineGap;
      const face = this.init();
      const result = wasm.ttfp_get_vertical_line_gap(face);
      this.cache.verticalLineGap = (result === 0) ? null : result;
      return this.cache.verticalLineGap;
    }

    unitsPerEm(): number | null {
      if (this.cache.unitsPerEm !== undefined) return this.cache.unitsPerEm;
      const face = this.init();
      const result = wasm.ttfp_get_units_per_em(face);
      this.cache.unitsPerEm = (result >= 16 && result <= 16384) ? result : null;
      return this.cache.unitsPerEm;
    }

    xHeight(): number | null {
      if (this.cache.xHeight !== undefined) return this.cache.xHeight;
      const face = this.init();
      const result = wasm.ttfp_get_x_height(face);
      this.cache.xHeight = (result === 0) ? null : result;
      return this.cache.xHeight;
    }

    capitalHeight(): number | null {
      if (this.cache.capitalHeight !== undefined) return this.cache.capitalHeight;
      const face = this.init();
      const result = wasm.ttfp_get_capital_height(face);
      this.cache.capitalHeight = (result === 0) ? null : result;
      return this.cache.capitalHeight;
    }

    underlineMetrics(): LineMetrics | null {
      if (this.cache.underlineMetrics !== undefined) return this.cache.underlineMetrics;
      const metricsPtr = this.freeptr;
      const metrics = new Int16Array(wasm.memory.buffer, metricsPtr, Face.LINE_METRICS_LENGTH);
      const face = this.init();
      const result = bool(wasm.ttfp_get_underline_metrics(face, metricsPtr));
      this.cache.underlineMetrics = (result === false) ? null : {
        position: metrics[0],
        thickness: metrics[1],
      };
      return this.cache.underlineMetrics;
    }

    strikeoutMetrics(): LineMetrics | null {
      if (this.cache.strikeoutMetrics !== undefined) return this.cache.strikeoutMetrics;
      const metricsPtr = this.freeptr;
      const metrics = new Int16Array(wasm.memory.buffer, metricsPtr, Face.LINE_METRICS_LENGTH);
      const face = this.init();
      const result = bool(wasm.ttfp_get_strikeout_metrics(face, metricsPtr));
      this.cache.strikeoutMetrics = (result === false) ? null : {
        position: metrics[0],
        thickness: metrics[1],
      };
      return this.cache.strikeoutMetrics;
    }

    subscriptMetrics(): ScriptMetrics | null {
      if (this.cache.subscriptMetrics !== undefined) return this.cache.subscriptMetrics;
      const metricsPtr = this.freeptr;
      const metrics = new Int16Array(wasm.memory.buffer, metricsPtr, Face.SCRIPT_METRICS_LENGTH);
      const face = this.init();
      const result = bool(wasm.ttfp_get_strikeout_metrics(face, metricsPtr));
      this.cache.subscriptMetrics = (result === false) ? null : {
        xSize: metrics[0],
        ySize: metrics[1],
        xOffset: metrics[2],
        yOffset: metrics[3],
      };
      return this.cache.subscriptMetrics;
    }

    superscriptMetrics(): ScriptMetrics | null {
      if (this.cache.superscriptMetrics !== undefined) return this.cache.superscriptMetrics;
      const metricsPtr = this.freeptr;
      const metrics = new Int16Array(wasm.memory.buffer, metricsPtr, Face.LINE_METRICS_LENGTH);
      const face = this.init();
      const result = bool(wasm.ttfp_get_strikeout_metrics(face, metricsPtr));
      this.cache.superscriptMetrics = (result === false) ? null : {
        xSize: metrics[0],
        ySize: metrics[1],
        xOffset: metrics[2],
        yOffset: metrics[3],
      };
      return this.cache.superscriptMetrics;
    }

    numberOfGlyphs(): number {
      if (this.cache.numberOfGlyphs !== undefined) return this.cache.numberOfGlyphs;
      const face = this.init();
      const result = wasm.ttfp_get_number_of_glyphs(face);
      this.cache.numberOfGlyphs = result;
      return result;
    }

    glyphIndex(char: string): GlyphId | null {
      if (this.cache.glyphIndex === undefined) this.cache.glyphIndex = {};
      const targetChar = char.charAt(0);
      const cache = this.cache.glyphIndex[targetChar];
      if (cache !== undefined) return cache;
      const face = this.init();
      const result = wasm.ttfp_get_glyph_index(face, targetChar.charCodeAt(0));
      const returnValue = (result === 0) ? null : result;
      this.cache.glyphIndex[targetChar] = returnValue;
      return returnValue;
    }

    glyphVariationIndex(char: string, variation: string): GlyphId | null {
      if (this.cache.glyphIndex === undefined) this.cache.glyphIndex = {};
      const targetChar = char.charAt(0);
      const targetVariation = variation.charAt(0);
      const cache = this.cache.glyphIndex[targetChar + targetVariation];
      if (cache !== undefined) return cache;
      const face = this.init();
      const result = wasm.ttfp_get_glyph_var_index(
        face, targetChar.charCodeAt(0), targetVariation.charCodeAt(0),
      );
      const returnValue = (result === 0) ? null : result;
      this.cache.glyphIndex[targetChar + targetVariation] = returnValue;
      return returnValue;
    }

    glyphHorAdvance(glyphId: GlyphId): number | null {
      if (this.cache.glyphHorAdvance === undefined) this.cache.glyphHorAdvance = {};
      const cache = this.cache.glyphHorAdvance[glyphId];
      if (cache !== undefined) return cache;
      const face = this.init();
      const result = wasm.ttfp_get_glyph_hor_advance(face, glyphId);
      const returnValue = (result === 0) ? null : result;
      this.cache.glyphHorAdvance[glyphId] = returnValue;
      return returnValue;
    }

    glyphVerAdvance(glyphId: GlyphId): number | null {
      if (this.cache.glyphVerAdvance === undefined) this.cache.glyphVerAdvance = {};
      const cache = this.cache.glyphVerAdvance[glyphId];
      if (cache !== undefined) return cache;
      const face = this.init();
      const result = wasm.ttfp_get_glyph_ver_advance(face, glyphId);
      const returnValue = (result === 0) ? null : result;
      this.cache.glyphVerAdvance[glyphId] = returnValue;
      return returnValue;
    }

    glyphHorSideBearing(glyphId: GlyphId): number | null {
      if (this.cache.glyphHorSideBearing === undefined) this.cache.glyphHorSideBearing = {};
      const cache = this.cache.glyphHorSideBearing[glyphId];
      if (cache !== undefined) return cache;
      const face = this.init();
      const result = wasm.ttfp_get_glyph_hor_side_bearing(face, glyphId);
      const returnValue = (result === 0) ? null : result;
      this.cache.glyphHorSideBearing[glyphId] = returnValue;
      return returnValue;
    }

    glyphVerSideBearing(glyphId: GlyphId): number | null {
      if (this.cache.glyphVerSideBearing === undefined) this.cache.glyphVerSideBearing = {};
      const cache = this.cache.glyphVerSideBearing[glyphId];
      if (cache !== undefined) return cache;
      const face = this.init();
      const result = wasm.ttfp_get_glyph_ver_side_bearing(face, glyphId);
      const returnValue = (result === 0) ? null : result;
      this.cache.glyphVerSideBearing[glyphId] = returnValue;
      return returnValue;
    }

    glyphYOrigin(glyphId: GlyphId): number | null {
      if (this.cache.glyphYOrigin === undefined) this.cache.glyphYOrigin = {};
      const cache = this.cache.glyphYOrigin[glyphId];
      if (cache !== undefined) return cache;
      const face = this.init();
      const result = wasm.ttfp_get_glyph_y_origin(face, glyphId);
      const returnValue = (result === 0) ? null : result;
      this.cache.glyphYOrigin[glyphId] = returnValue;
      return returnValue;
    }

    glyphName(glyphId: GlyphId): Uint8Array | null {
      if (this.cache.glyphName === undefined) this.cache.glyphName = {};
      const cache = this.cache.glyphName[glyphId];
      if (cache !== undefined) return cache;
      const face = this.init();
      const namePtr = this.freeptr;
      const name = new Uint8Array(wasm.memory.buffer, namePtr, Face.GLYPH_NAME_LENGTH);
      const result = bool(wasm.ttfp_get_glyph_name(face, glyphId, namePtr));
      const returnValue = !result ? null : name.slice();
      this.cache.glyphName[glyphId] = returnValue;
      return returnValue;
    }

    glyphClass(glyphId: GlyphId): GlyphClass | null {
      if (this.cache.glyphClass === undefined) this.cache.glyphClass = {};
      const cache = this.cache.glyphClass[glyphId];
      if (cache !== undefined) return cache;
      const face = this.init();
      const result = wasm.ttfp_get_glyph_class(face, glyphId);
      const returnValue = (result === 0) ? null : GlyphClass[result];
      this.cache.glyphClass[glyphId] = returnValue;
      return returnValue;
    }

    glyphMarkAttachmentClass(glyphId: GlyphId): number {
      if (this.cache.glyphMarkAttachmentClass === undefined) {
        this.cache.glyphMarkAttachmentClass = {};
      }
      const cache = this.cache.glyphMarkAttachmentClass[glyphId];
      if (cache !== undefined) return cache;
      const face = this.init();
      const result = wasm.ttfp_get_glyph_mark_attachment_class(face, glyphId);
      this.cache.glyphMarkAttachmentClass[glyphId] = result;
      return result;
    }

    isMarkGlyph(glyphId: GlyphId): boolean {
      if (this.cache.isMarkGlyph === undefined) this.cache.isMarkGlyph = {};
      const cache = this.cache.isMarkGlyph[glyphId];
      if (cache !== undefined) return cache;
      const face = this.init();
      const result = bool(wasm.ttfp_is_mark_glyph(face, glyphId));
      this.cache.isMarkGlyph[glyphId] = result;
      return result;
    }

    glyphBoundingBox(glyphId: GlyphId): Rect | null {
      if (this.cache.glyphBoundingBox === undefined) this.cache.glyphBoundingBox = {};
      const cache = this.cache.glyphBoundingBox[glyphId];
      if (cache !== undefined) return cache;
      const face = this.init();
      const bboxPtr = this.freeptr;
      const bbox = new Int16Array(wasm.memory.buffer, bboxPtr, Face.RECT_LENGTH);
      const result = bool(wasm.ttfp_get_glyph_bbox(face, glyphId, bboxPtr));
      const returnValue = !result ? null : {
        xMin: bbox[0],
        yMin: bbox[1],
        xMax: bbox[2],
        yMax: bbox[3],
      };
      this.cache.glyphBoundingBox[glyphId] = returnValue;
      return returnValue;
    }

    variationAxes(): VariationAxis[] {
      if (this.cache.variationAxes !== undefined) return this.cache.variationAxes;
      const face = this.init();
      const count = wasm.ttfp_get_variation_axes_count(face);
      const tagPtr = this.freeptr;
      const tag = new Uint32Array(wasm.memory.buffer, tagPtr, Face.TAG_LENGTH);
      const minValuePtr = tagPtr + (Face.TAG_LENGTH * 4);
      const minValue = new Float32Array(wasm.memory.buffer, minValuePtr, 1);
      const defValuePtr = minValuePtr + 4;
      const defaultValue = new Float32Array(wasm.memory.buffer, defValuePtr, 1);
      const maxValuePtr = defValuePtr + 4;
      const maxValue = new Float32Array(wasm.memory.buffer, maxValuePtr, 1);
      const nameIdPtr = maxValuePtr + 4;
      const nameId = new Uint16Array(wasm.memory.buffer, nameIdPtr, 1);
      const hiddenPtr = nameIdPtr + 2;
      const hidden = new Uint8Array(wasm.memory.buffer, hiddenPtr, 1);
      const result = Array(count).fill(0).map<VariationAxis | null>((_, i) => {
        const res = bool(wasm.ttfp_get_variation_axis(face, i, tagPtr));
        if (!res) return null;
        return {
          tag: tag[0],
          minValue: minValue[0],
          defaultValue: defaultValue[0],
          maxValue: maxValue[0],
          nameId: nameId[0],
          hidden: hidden[0] !== 0,
        };
      }).filter(nonNull);
      this.cache.variationAxes = result;
      return result;
    }
  }

  return { fontsInCollection, Face };
};
