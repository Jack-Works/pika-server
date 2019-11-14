import { Loader } from '..'
import { importGlobal } from '../../utils/import'

export default {
    // Yes but sad.
    canHandle: 'video/mp2t',
    transformESModule: async (source, ctx) => {
        try {
            const ts = await importGlobal<typeof import('typescript')>('typescript')
            const result = ts.transpileModule(source, {
                compilerOptions: {
                    jsx: ts.JsxEmit.React,
                    module: ts.ModuleKind.ESNext,
                    target: ts.ScriptTarget.ES2018,
                    sourceMap: true,
                    inlineSources: true,
                    inlineSourceMap: true,
                },
                fileName: ctx.originalUrl,
            })
            return result.outputText
        } catch (e) {
            return `
throw new TypeError('To import TypeScript directly, you should install a TypeScript compiler in the global scope.')
export default undefined`
        }
    },
    redirectHandler(type, path) {
        if (type !== 'script') return []
        return [path + '.tsx', path + '.ts', path + '/index.tsx', path + '/index.ts']
    },
} as Loader
