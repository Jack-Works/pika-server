import { Loader } from '..'

function create(x: string) {
    const css = new CSSStyleSheet()
    const hasImport = x.includes('@import')
    // @ts-ignore
    if (hasImport) css.replace(x)
    // @ts-ignore
    else css.replaceSync(x)
    return css
}

export default {
    canHandle: 'text/css',
    transformESModule(x) {
        return `export default ${create.name}(${JSON.stringify(x)})
${create.toString()}`
    },
} as Loader
