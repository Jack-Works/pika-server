import Koa from 'koa'
import { Loaders, LoaderContext } from '../Loaders'
import { ReadStreamToString } from '../utils/ReadStreamToString'
import { ReadStream } from 'fs'
import { SecFetchDest, PikaContext } from '../types'
export async function PikaLoader(
    ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & PikaContext>,
    next: Koa.Next,
) {
    await next()
    const secFetchDest: SecFetchDest = ctx.headers['sec-fetch-dest']
    const originalMineType = ctx.response.type
    for (const loader of Loaders) {
        if (typeof loader.canHandle === 'string') {
            const _ = loader.canHandle
            loader.canHandle = async (mineType: string) => _ === mineType
        }
        let source: string
        async function readSource() {
            if (typeof source === 'undefined') return (source = await ReadStreamToString(ctx.body))
            return source
        }
        const loaderCtx: LoaderContext = {
            serveBasePath: ctx.serveRoot,
            originalUrl: ctx.originalUrl,
            path: ctx.path,
            readAsString: readSource,
            secFetchDest: secFetchDest,
            get mineType() {
                return ctx.response.type
            },
            set mineType(type) {
                ctx.response.type = type
            },
            async readAsStream() {
                if (ctx.body instanceof ReadStream) return ctx.body
                else throw new TypeError('Invalid internal state')
            },
        }
        if (await loader.canHandle(originalMineType, loaderCtx)) {
            if (secFetchDest === 'script' && loader.transformESModule) {
                ctx.response.type = '.js'
                ctx.body = await loader.transformESModule(await readSource(), loaderCtx)
                break
            } else if (secFetchDest === 'document' && loader.transformDocument) {
                ctx.response.type = '.html'
                ctx.body = await loader.transformDocument(await readSource(), loaderCtx)
                break
            } else if (secFetchDest === 'style' && loader.transformStyle) {
                ctx.response.type = '.css'
                ctx.body = await loader.transformStyle(await readSource(), loaderCtx)
                break
            } else if (loader.transform) {
                ctx.body = await loader.transform(loaderCtx)
            } else {
                ctx.body = await readSource()
            }
        } else {
            // @ts-ignore
            if (typeof source !== 'undefined') {
                ctx.body = source
            }
        }
    }
}
