import * as math from './math'
console.log(math)

import json from '../node_modules/lodash-es/package.json'
console.log(json)

async function wasm() {
    return WebAssembly.instantiateStreaming(fetch('../other/hello.wat'))
}
wasm()
