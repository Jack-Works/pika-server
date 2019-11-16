import { Loader } from '.'

export default {
    canHandle: 'application/json',
    transformESModule: x => {
        /**
         *  Let  json  be ?  Call  (  %JSONParse% , undefined, «  source  »).
         *  If this throws an exception, set  script  's  parse error  to that exception, and return  script .
         */
        try {
            JSON.parse(x)
            return `export default ${x}`
        } catch {
            return `export default undefined
throw new SyntaxError('Failed to load module json: The server responded with an invalid JSON file.')
/**
Original file:
${x}
*/
`
        }
    },
    transformDocument: x =>
        `<meta charset="UTF-8" /><pre><code>${JSON.stringify(JSON.parse(x), undefined, 4)}</code></pre>`,
} as Loader
