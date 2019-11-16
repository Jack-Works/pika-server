import { Loader } from '.'

export default {
    canHandle: async (mineType, ctx) => {
        const result = ['.wat', '.wast', '.wasm'].some(x => ctx.path.endsWith(x))
        if (result === true) ctx.setMineType('application/wasm')
        return result
    },
} as Loader
