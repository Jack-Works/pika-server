import { Loader } from '..'
import { importGlobal } from '../../utils/import'
import { promisify } from 'util'

export default {
    canHandle: 'text/less',
    async transformStyle(source, req) {
        const less = await importGlobal<typeof import('less')>('less')
        const render = await less.render(source, { filename: req.path, sourceMap: { sourceMapFileInline: true } })
        return render.css
    },
} as Loader
