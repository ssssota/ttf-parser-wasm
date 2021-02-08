import { join } from 'path';
import { readFileSync } from 'fs';
import { createExport } from './lib/implements';

const wasm = new WebAssembly.Instance(
  new WebAssembly.Module(readFileSync(join(__dirname, '../ttfparser.wasm'))),
);

export const { fontsInCollection, Face } = createExport(wasm);
