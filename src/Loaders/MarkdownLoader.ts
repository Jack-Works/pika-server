import { Loader } from '.'
import { importGlobal } from '../utils/import'

const msg = 'To render markdown, you need to have install package `markdown-it`'
export default {
    canHandle: 'text/markdown',
    async transformHTML(source) {
        try {
            const md = await importGlobal<typeof import('markdown-it')>('markdown-it')
            return `<meta charset="UTF-8" /><article class="markdown-body">
${new md().render(source)}
</article>
<style>
@import 'https://sindresorhus.com/github-markdown-css/github-markdown.css';
body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 45px;
}
@media (prefers-color-scheme: dark) {
    body { background: black; filter: invert(1); }
    img { filter: invert(1) grayscale(1); opacity: 0.6; }
}
</style>`
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
