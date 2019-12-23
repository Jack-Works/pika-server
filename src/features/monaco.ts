import Koa from 'koa'
import KoaStatic from 'koa-static'
import { join } from 'path'
import { LoaderContext } from '../Loaders'
import { PikaContext } from '../types'

const reservedPackageName = '@pika/server'

const monacoRoot = join(__dirname, '../../node_modules/monaco-editor/')
const _ = KoaStatic(monacoRoot)
const pkg = `/node_modules/${reservedPackageName}/monaco-editor`
/**
 * Delegate path to local node_modules
 */
export default async function monaco(
    ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & PikaContext>,
    next: Koa.Next,
) {
    if (ctx.path.startsWith(pkg)) {
        ctx.servePath = ctx.path.replace(pkg, '')
        ctx.serveRoot = monacoRoot
        _(
            new Proxy(ctx, {
                get(target, key: any) {
                    if (key === 'path') return ctx.servePath
                    return target[key]
                },
            }),
            async () => {},
        )
    }
    await next()
}

export function generateMonacoTemplate(source: string, ctx: LoaderContext) {
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <link rel="stylesheet" href="https://unpkg.com/highlight.js@9.16.2/styles/solarized-dark.css" media="(prefers-color-scheme: dark)">
            <link rel="stylesheet" href="https://unpkg.com/highlight.js@9.16.2/styles/solarized-light.css" media="(prefers-color-scheme: light)">
            <meta charset="UTF-8" />
            <style>
                body { margin: 0; }
                * { box-sizing: border-box; }
                #code { height: 100vh; padding: 1em; zoom: 1.2; }
                pre { margin: 0; }
            </style>
        </head>
        <body>
            <pre><code id="code"></code></pre>
            <script type="module">
            ${monacoLoader.toString()}
            monacoLoader(atob("${btoa(source)}"), () => import('${pkg}/esm/vs/editor/editor.main.js'))
            </script>
        </body>
    </html>
    `
}

async function monacoLoader(source: string, _monaco: () => Promise<typeof import('monaco-editor')>) {
    const languageMap = {
        tsx: 'typescript',
        ts: 'typescript',
        js: 'javascript',
        jsx: 'typescript',
        css: 'css',
        json: 'json',
    }
    const [, ext] = location.pathname.match(/.+\.(.+)$/) || []
    const lang = languageMap[ext as keyof typeof languageMap]
    if (lang === undefined) {
        const code = document.querySelector('code')!
        code.innerText = source
        const script = document.createElement('script')
        script.src = `https://unpkg.com/highlight.js@9.16.2/lib/highlight.js`
        document.body.appendChild(script)
        script.onload = () => {
            // @ts-ignore
            hljs.highlightBlock(code)
        }
        return
    }
    // @ts-ignore
    globalThis.MonacoEnvironment = {
        getWorkerUrl(workerID: string, label: string) {
            const workerMap: Record<string, string> = {
                json: 'json/json.worker.js',
                html: 'html/html.worker.js',
                css: 'css/css.worker.js',
                javascript: 'typescript/ts.worker.js',
                typescript: 'typescript/ts.worker.js',
                editorWorkerService: '../editor/editor.worker.js',
                undefined: label,
            }
            return `/node_modules/monaco-editor/esm/vs/language/${workerMap[label]}`
        },
    }
    const editor = document.createElement('main')
    editor.style.height = '100vh'
    editor.style.width = '100vw'
    document.body.appendChild(editor)
    // @ts-ignore
    globalThis.__pika_css_apply__ = document
    // Let monaco load Worker as ESModule
    Worker = new Proxy(Worker, {
        construct(target, args, newTarget) {
            return Reflect.construct(target, [args[0], { type: 'module' }], newTarget)
        },
    })
    const monaco = await _monaco()
    monaco.editor.create(editor, {
        value: source,
        language: lang,
        theme: matchMedia(`prefers-color-scheme: dark`) ? 'vs-dark' : 'vs',
    })
}
