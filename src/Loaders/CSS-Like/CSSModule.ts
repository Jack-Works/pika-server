import { Loader } from '..'

function create(x: string) {
    const css = new CSSStyleSheet()
    const hasImport = x.includes('@import')
    // @ts-ignore
    if (hasImport) css.replace(x)
    // @ts-ignore
    else css.replaceSync(x)
    if ('__pika_css_apply__' in globalThis) {
        // @ts-ignore
        __pika_css_apply__.adoptedStyleSheets = [...__pika_css_apply__.adoptedStyleSheets, css]
    }
    return css
}
export default {
    canHandle: 'text/css',
    transformESModule(x) {
        return `export default ${create.name}(${JSON.stringify(x)})
${create.toString()}`
    },
} as Loader
