import { Loader } from '.'

function deepFreeze(obj: unknown) {
    if (typeof obj === 'object') {
        Object.freeze(obj)
        for (const key in obj) deepFreeze((obj as any)[key])
        return obj
    }
    return obj
}

export default {
    canHandle: 'application/json',
    transformESModule: x => `export default deepFreeze(${x})
${deepFreeze.toString()}`,
    transformHTML: x =>
        `<meta charset="UTF-8" /><pre><code>${JSON.stringify(JSON.parse(x), undefined, 4)}</code></pre>`,
} as Loader
