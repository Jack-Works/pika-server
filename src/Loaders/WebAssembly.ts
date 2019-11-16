import { Loader } from '.'

export default {
    canHandle: async (mineType, ctx) => {
        const result = ['.wat', '.wast', '.wasm'].some(x => ctx.path.endsWith(x))
        if (result === true) ctx.mineType = 'application/wasm'
        return result
    },
    transform(ctx) {
        if (ctx.path.endsWith('.wasm')) return ctx.readAsStream()
        return ''
    },
} as Loader
