import { Loader } from '..'

export default {
    canHandle: 'text/css',
    transformESModule(x) {
        return `const css = new CSSStyleSheet()
css.replaceSync(${JSON.stringify(x)})
export default css`
    },
} as Loader
