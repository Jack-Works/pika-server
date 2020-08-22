import Koa from 'koa'
export async function nodeModuleCache(ctx: Koa.Context, next: Koa.Next) {
    await next()
    if (ctx.path.startsWith('/node_modules/') && ctx.response.status < 400) {
        ctx.set('Cache-Control', 'public immutable max-age=604800')
    }
}
