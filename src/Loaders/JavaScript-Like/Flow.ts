import { Loader } from '..'
import { importGlobal } from '../../utils/import'

export default {
    canHandle: async (mineType, getSource) => {
        if (mineType === 'application/javascript') {
            const x = await getSource()
            if (x.indexOf(`@flow`) !== -1) return true
            return false
        }
        return false
    },
    async transformESModule(source, req) {
        try {
            const flow = await importGlobal<FlowAPI>('flow-remove-types')
            const result = flow(source, { pretty: true })
            const sourceMap = result.generateMap()
            sourceMap.sourcesContent = [source]
            sourceMap.file = req.path
            sourceMap.sources = [req.path]
            return (
                result.toString() +
                `
//# sourceMappingURL=data:application/json;base64,${Buffer.from(JSON.stringify(sourceMap)).toString('base64')}`
            )
        } catch (e) {
            return `export default undefined; throw new TypeError("To transform flow.js, install the flow-remote-types package\\n${e.message}")`
        }
    },
} as Loader
type FlowAPI = {
    (source: string, options?: Partial<{ all: boolean; pretty: boolean }>): {
        toString(): string
        generateMap(): {
            mappings: string
            names: unknown[]
            sources: string[]
            version: 3
            file?: string
            sourceRoot?: string
            sourcesContent?: string[]
        }
    }
}
