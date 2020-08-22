import Koa from 'koa'
import { Loaders } from '../Loaders'
import { join } from 'path'
import { SecFetchDest, PikaContext } from '../types'
import { exist } from '../index'
export async function loaderRedirectHandler(
    ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & PikaContext>,
    next: Koa.Next,
) {
    if (ctx.response.status === 404) {
        const secFetchDest: SecFetchDest = ctx.headers['sec-fetch-dest']
        searching: for (const loader of Loaders) {
            if (!loader.redirectHandler) continue
            const pathMap = (() => {
                const map: [string, string][] = []
                const servePathMap = loader.redirectHandler(secFetchDest, ctx.servePath)
                const realPathMap = loader.redirectHandler(secFetchDest, ctx.path)
                servePathMap.forEach((v, i) => map.push([v, realPathMap[i]]))
                return new Map(map)
            })()
            for (const [mappedPath, realPath] of pathMap) {
                const physicalPath = join(ctx.serveRoot, mappedPath)
                if (await exist(physicalPath)) {
                    ctx.redirect(realPath)
                    break searching
                }
            }
        }
    }
    return next()
}
