# ttf-parser-node

WASM wrapper of ttf-parser for Node.js.

## Example

```js
const { fontsInCollection, Face } = require('ttf-parser-node');

const data = require('fs').readFileSync('path/to/truetypecollection.ttc');
const count = fontsInCollection(data);
const faces = Array(count).fill(0).map((_, i) => new Face(data, i));

faces.forEach(face => {
  console.log(face.isRegular());
  console.log(face.isItalic());
  console.log(face.isVariable());
  console.log(face.weight());
});
```
