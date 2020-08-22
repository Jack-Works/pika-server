import Koa from 'koa'
import { resolveNpmNamespace, nodeStyleResolution } from '../Loaders/JavaScript-Like/NodeStyleResolution'
import { SecFetchDest, isScriptLikeTarget as isScriptLikeDest } from '../types'
export async function nodeStyleResolutionMiddleware(ctx: Koa.Context, next: Koa.Next) {
    if (ctx.response.status === 404) {
        const secFetchDest: SecFetchDest = ctx.headers['sec-fetch-dest']
        if (isScriptLikeDest(secFetchDest) && ctx.path.startsWith('/node_modules/')) {
            const { subPath, fullModuleName } = resolveNpmNamespace(
                ctx.path.replace('/node_modules/', ''),
                ctx.serveRoot,
            )
            if (subPath === '') ctx.redirect(nodeStyleResolution(fullModuleName, ctx.serveRoot))
        }
    }
    return next()
}
