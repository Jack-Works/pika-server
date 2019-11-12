import { Loader } from '..'
import { importGlobal } from '../../utils/import'

export default {
    canHandle: 'text/coffeescript',
    async transformESModule(source, req) {
        try {
            // @ts-ignore
            const coffee = await importGlobal<CoffeeAPI>('coffeescript')
            const x = coffee.compile(source, { inlineMap: true, sourceMap: true, filename: req.path })
            return x.js
        } catch {
            return 'To transform CoffeeScript into ESModule, install a "coffeescript" package'
        }
    },
} as Loader
type CoffeeAPI = {
    compile(
        source: string,
        options?: Partial<{ sourceMap: boolean; inlineMap: boolean; filename: string }>,
    ): { js: string; sourceMap: unknown; v3SourceMap: string }
}
