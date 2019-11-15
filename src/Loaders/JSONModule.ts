import { Loader } from '.'

export default {
    canHandle: 'application/json',
    // TODO: deep freeze.
    transformESModule: x => `export default Object.preventExtensions(Object.freeze(${x}))`,
    transformHTML: x =>
        `<meta charset="UTF-8" /><pre><code>${JSON.stringify(JSON.parse(x), undefined, 4)}</code></pre>`,
} as Loader
