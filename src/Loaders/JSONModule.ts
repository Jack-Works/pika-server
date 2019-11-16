import { Loader } from '.'
import { importGlobal } from '../utils/import'

export default {
    canHandle: 'application/json',
    transformESModule: async x => {
        /**
         *  Let  json  be ?  Call  (  %JSONParse% , undefined, «  source  »).
         *  If this throws an exception, set  script  's  parse error  to that exception, and return  script .
         */
        try {
            const JSONC = await importGlobal<typeof import('jsonc')>('jsonc').then(
                x => x.jsonc,
                () => JSON,
            )
            JSONC.parse(x)
            return `export default ${x}`
        } catch {
            return `export default undefined
throw new SyntaxError('Failed to load module json: The server responded with an invalid JSON file.')
/**
 * Notice: to import JSON with Comments, install the JSONC package.
 * Original file:
${x}
 */
`
        }
    },
    transformDocument: x =>
        `<meta charset="UTF-8" /><pre><code>${JSON.stringify(JSON.parse(x), undefined, 4)}</code></pre>`,
} as Loader
