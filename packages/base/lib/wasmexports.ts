/* eslint-disable camelcase */
import { GlyphClass, GlyphId, TableName } from './types';

export type Pointer = number;
export type FacePointer = Pointer;
export type InternalTableName = typeof TableName[keyof typeof TableName];
export type InternalGlyphClass = 0 | keyof typeof GlyphClass;
export type WasmBool = 0 | 1;

export type WasmExports = {
  memory: WebAssembly.Memory;
  __heap_base: WebAssembly.Global;
  __data_end: WebAssembly.Global;
  ttfp_fonts_in_collection: (data: Pointer, len: number) => number;
  ttfp_face_init: (data: Pointer, len: number, index: number, face: Pointer) => void;
  ttfp_face_size_of: () => number;
  ttfp_has_table: (face: FacePointer, name: InternalTableName) => WasmBool;
  ttfp_get_name_records_count: (face: FacePointer) => number;
  ttfp_get_name_record: (face: FacePointer, index: number, record: Pointer) => WasmBool;
  ttfp_get_name_record_string: (
    face: FacePointer, index: number, name: Pointer, len: number
  ) => WasmBool;
  ttfp_is_regular: (face: FacePointer) => WasmBool;
  ttfp_is_italic: (face: FacePointer) => WasmBool;
  ttfp_is_bold: (face: FacePointer) => WasmBool;
  ttfp_is_oblique: (face: FacePointer) => WasmBool;
  ttfp_is_monospaced: (face: FacePointer) => WasmBool;
  ttfp_is_variable: (face: FacePointer) => WasmBool;
  ttfp_get_weight: (face: FacePointer) => number;
  ttfp_get_width: (face: FacePointer) => number;
  ttfp_get_italic_angle: (face: FacePointer) => number;
  ttfp_get_ascender: (face: FacePointer) => number;
  ttfp_get_descender: (face: FacePointer) => number;
  ttfp_get_height: (face: FacePointer) => number;
  ttfp_get_line_gap: (face: FacePointer) => number;
  ttfp_get_typographic_ascender: (face: FacePointer) => number;
  ttfp_get_typographic_descender: (face: FacePointer) => number;
  ttfp_get_typographic_line_gap: (face: FacePointer) => number;
  ttfp_get_vertical_ascender: (face: FacePointer) => number;
  ttfp_get_vertical_descender: (face: FacePointer) => number;
  ttfp_get_vertical_height: (face: FacePointer) => number;
  ttfp_get_vertical_line_gap: (face: FacePointer) => number;
  ttfp_get_units_per_em: (face: FacePointer) => number;
  ttfp_get_x_height: (face: FacePointer) => number;
  ttfp_get_capital_height: (face: FacePointer) => number;
  ttfp_get_underline_metrics: (face: FacePointer, metrics: Pointer) => WasmBool;
  ttfp_get_strikeout_metrics: (face: FacePointer, metrics: Pointer) => WasmBool;
  ttfp_get_subscript_metrics: (face: FacePointer, metrics: Pointer) => WasmBool;
  ttfp_get_superscript_metrics: (face: FacePointer, metrics: Pointer) => WasmBool;
  ttfp_get_number_of_glyphs: (face: FacePointer) => number;
  ttfp_get_glyph_index: (face: FacePointer, codepoint: number) => number;
  ttfp_get_glyph_var_index: (face: FacePointer, codepoint: number, variation: number) => number;
  ttfp_get_glyph_hor_advance: (face: FacePointer, glyphId: GlyphId) => number;
  ttfp_get_glyph_ver_advance: (face: FacePointer, glyphId: GlyphId) => number;
  ttfp_get_glyph_hor_side_bearing: (face: FacePointer, glyphId: GlyphId) => number;
  ttfp_get_glyph_ver_side_bearing: (face: FacePointer, glyphId: GlyphId) => number;
  ttfp_get_glyph_y_origin: (face: FacePointer, glyphId: GlyphId) => number;
  ttfp_get_glyph_name: (face: FacePointer, glyphId: GlyphId, name: Pointer) => WasmBool;
  ttfp_get_glyph_class: (face: FacePointer, glyphId: GlyphId) => InternalGlyphClass;
  ttfp_get_glyph_mark_attachment_class: (face: FacePointer, glyphId: GlyphId) => number;
  ttfp_is_mark_glyph: (face: FacePointer, glyphId: GlyphId) => WasmBool;
  ttfp_glyph_variation_delta: (face: FacePointer, outerIndex: number, innerIndex: number) => number;
  ttfp_outline_glyph: (
    face: FacePointer, builder: Pointer, userData: Pointer, glyphId: GlyphId, bbox: Pointer
  ) => WasmBool;
  ttfp_get_glyph_bbox: (face: FacePointer, glyphId: GlyphId, bbox: Pointer) => WasmBool;
  ttfp_get_global_bounding_box: (face: FacePointer) => Pointer;
  ttfp_get_glyph_raster_image: (
    face: FacePointer, glyphId: GlyphId, pixelsPerEm: number, glyphImage: Pointer
  ) => WasmBool;
  ttfp_get_glyph_svg_image: (
    face: FacePointer, glyphId: GlyphId, svg: Pointer, len: Pointer
  ) => WasmBool;
  ttfp_get_variation_axes_count: (face: FacePointer) => number;
  ttfp_get_variation_axis: (face: FacePointer, index: number, axis: Pointer) => WasmBool;
  ttfp_get_variation_axis_by_tag: (face: FacePointer, tag: number, axis: Pointer) => WasmBool;
  ttfp_set_variation: (face: FacePointer, axis: number, value: number) => WasmBool;
  ttfp_get_variation_coordinates: (face: FacePointer) => number;
  ttfp_has_non_default_variation_coordinates: (face: FacePointer) => WasmBool;
};
