import { Loader } from '..'
import { importGlobal } from '../../utils/import'
import { isScriptLikeTarget } from '../../types'
import { generateMonacoTemplate } from '../../features/monaco'

export default {
    canHandle: 'text/coffeescript',
    async transformESModule(source, req) {
        try {
            const coffee = await importGlobal<CoffeeAPI>('coffeescript')
            const x = coffee.compile(source, { inlineMap: true, sourceMap: true, filename: req.path })
            return x.js
        } catch {
            return source + `\nconsole.warn('to transform CoffeeScript, install the coffeescript package')`
        }
    },
    redirectHandler(type, path) {
        if (!isScriptLikeTarget(type)) return []
        return [path + '.coffee']
    },
    transformDocument: generateMonacoTemplate,
} as Loader
type CoffeeAPI = {
    compile(
        source: string,
        options?: Partial<{ sourceMap: boolean; inlineMap: boolean; filename: string }>,
    ): { js: string; sourceMap: unknown; v3SourceMap: string }
}
