import { Loader } from '.'
import { importGlobal } from '../utils/import'
import { ReadStream } from 'fs'

export default {
    canHandle: async (mineType, ctx) => {
        return ['.wat', '.wast', '.wasm'].some(x => ctx.path.endsWith(x))
    },
    async transform(ctx) {
        ctx.mineType = 'application/wasm'
        if (ctx.path.endsWith('.wasm')) return ctx.readAsStream()
        const wabt = (await importGlobal<() => typeof import('wabt')>('wabt'))()
        const buffer = wabt.parseWat(ctx.path, await ctx.readAsString()).toBinary({ write_debug_names: true }).buffer
        return new Buffer(buffer)
    },
} as Loader
