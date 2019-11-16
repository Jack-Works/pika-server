import { Loader } from '..'
import { importGlobal } from '../../utils/import'
import CSSModule from './CSSModule'

export default {
    canHandle: 'text/less',
    async transformStyle(source, ctx) {
        const less = await importGlobal<typeof import('less')>('less')
        const render = await less.render(source, { filename: ctx.path, sourceMap: { sourceMapFileInline: true } })
        return render.css
    },
    async transformESModule(source, ctx) {
        return CSSModule.transformESModule!(await this.transformStyle!(source, ctx), ctx)
    },
} as Loader
