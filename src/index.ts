#!/usr/bin/env node
import Koa from 'koa'
import KoaStatic from 'koa-static'
import { ReadStream } from 'fs'
import { Loaders } from './Loaders'

import CSSLoader from './Loaders/CSSModule'
import JSONLoader from './Loaders/JSONModule'
import TSLoader from './Loaders/TypeScript'
import MarkdownLoader from './Loaders/MarkdownLoader'
import CoffeeScript from './Loaders/CoffeeScript'
Loaders.add(CSSLoader)
Loaders.add(JSONLoader)
Loaders.add(TSLoader)
Loaders.add(MarkdownLoader)
Loaders.add(CoffeeScript)

const app = new Koa()

app.use(async (ctx, next) => {
    await next()
    const secFetchDest: string = ctx.headers['sec-fetch-dest']
    const originalType = ctx.response.type
    for (const x of Loaders) {
        if (originalType === x.canHandle) {
            if (secFetchDest === 'script' && x.transformESModule) {
                ctx.body = await x.transformESModule(await ReadStreamToString(ctx.body), ctx.request)
                ctx.response.type = '.js'
                break
            } else if (secFetchDest === 'document' && x.transformHTML) {
                ctx.body = await x.transformHTML(await ReadStreamToString(ctx.body))
                ctx.response.type = '.html'
                break
            }
        }
    }
})
app.use(KoaStatic('./demo/', { hidden: true }))

async function ReadStreamToString(readable: ReadStream) {
    let result = ''
    for await (const chunk of readable) {
        result += chunk
    }
    return result
}

app.listen(3000)
