import { Loader } from '..'

export default {
    canHandle: 'text/css',
    transformESModule(x) {
        return `export default create(${JSON.stringify(x)})
function create(x) {
    const css = new CSSStyleSheet()
    const hasImport = x.includes('@import')
    if (hasImport) css.replace(x)
    else css.replaceSync(x)
    if (new URL(import.meta.url).pathname.startsWith('/node_modules/monaco-editor/')) {
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, css]
    }
    return css
}`
    },
} as Loader
