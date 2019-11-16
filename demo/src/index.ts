import * as math from './math'
console.log(math)

import json from '../node_modules/lodash-es/package.json'
console.log(json)

async function wasm() {
    let memory: Uint8Array
    fetch('../other/hello.wat')
        .then(response => response.arrayBuffer())
        .then(bytes =>
            WebAssembly.instantiate(bytes, {
                env: {
                    jsprint: function jsprint(byteOffset) {
                        var string = ''
                        var a = new Uint8Array(memory.buffer)
                        for (var i = byteOffset; a[i]; i++) {
                            string += String.fromCharCode(a[i])
                        }
                        const code = document.createElement('code')
                        code.innerText = string
                        document.body.appendChild(code)
                    },
                },
            }),
        )
        .then(results => {
            const instance = results.instance
            memory = instance.exports.pagememory
            instance.exports.helloworld()
        })
        .catch(console.error)
}
wasm()
