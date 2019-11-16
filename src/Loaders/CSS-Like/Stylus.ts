import { Loader } from '..'
import { importGlobal } from '../../utils/import'
import { promisify } from 'util'
import CSSModule from './CSSModule'

export default {
    canHandle: 'text/stylus',
    async transformStyle(source, ctx) {
        const stylus = await importGlobal<typeof import('stylus')>('stylus')
        return promisify(stylus.render)(source)
    },
    async transformESModule(source, ctx) {
        return CSSModule.transformESModule!(await this.transformStyle!(source, ctx), ctx)
    },
} as Loader
