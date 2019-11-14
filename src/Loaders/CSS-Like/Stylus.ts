import { Loader } from '..'
import { importGlobal } from '../../utils/import'
import { promisify } from 'util'

export default {
    canHandle: 'text/stylus',
    async transformStyle(source, ctx) {
        const stylus = await importGlobal<typeof import('stylus')>('stylus')
        return promisify(stylus.render)(source)
    },
} as Loader
