import { Loader } from '.'
import { importGlobal } from '../utils/import'

const msg = 'To render markdown, you need to have install package `markdown-it`'
export default {
    canHandle: 'text/markdown',
    async transformHTML(source) {
        try {
            const md = await importGlobal<typeof import('markdown-it')>('markdown-it')
            return new md().render(source)
        } catch (e) {
            return msg + `<pre>` + e.message + `</pre>`
        }
    },
    async transformESModule(source) {
        try {
            const md = new (await importGlobal<typeof import('markdown-it')>('markdown-it'))()
            return `const p = document.createElement('p')
p.innerHTML = ${JSON.stringify(md.render(source))}
export default p`
        } catch {
            return `export default undefined
throw new TypeError(${JSON.stringify(msg)})`
        }
    },
} as Loader
