import { Loader } from '..'
import { importGlobal } from '../../utils/import'
import { promisify } from 'util'
import CSSModule from './CSSModule'

export default {
    canHandle: async x => x === 'text/x-scss' || x === 'text/x-sass',
    async transformStyle(source, ctx) {
        const scss = await importGlobal<typeof import('sass')>('sass')
        try {
            const result = await promisify(scss.render)({
                data: source,
                indentedSyntax: ctx.path.endsWith('.sass'),
                sourceMap: true,
                sourceMapContents: true,
                outFile: ctx.path,
                omitSourceMapUrl: true,
            })
            const sourceMap = JSON.parse(result.map!.toString('utf-8'))
            sourceMap.sources = [ctx.path]
            const css = result.css.toString('utf-8')
            return css + `\n/*# sourceMappingURL=data:application/json;base64,${btoa(JSON.stringify(sourceMap))} */`
        } catch (e) {
            return source + `\n/* Compile Error:\n${e.message} */`
        }
    },
    async transformESModule(source, ctx) {
        return CSSModule.transformESModule!(await this.transformStyle!(source, ctx), ctx)
    },
} as Loader
