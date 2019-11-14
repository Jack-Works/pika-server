#!/usr/bin/env node
import Koa from 'koa'
import KoaStatic from 'koa-static'
import { Loaders } from './Loaders'
import { ReadStreamToString } from './utils/ReadStreamToString'

import JSONLoader from './Loaders/JSONModule'
import MarkdownLoader from './Loaders/MarkdownLoader'
import CSSModule from './Loaders/CSS-Like/CSSModule'
import TypeScript from './Loaders/JavaScript-Like/TypeScript'
import CoffeeScript from './Loaders/JavaScript-Like/CoffeeScript'
import Flow from './Loaders/JavaScript-Like/Flow'
import SCSS from './Loaders/CSS-Like/SCSS'
import LESS from './Loaders/CSS-Like/LESS'
import Stylus from './Loaders/CSS-Like/Stylus'
Loaders.add(CSSModule)
Loaders.add(JSONLoader)
Loaders.add(TypeScript)
Loaders.add(MarkdownLoader)
Loaders.add(CoffeeScript)
Loaders.add(Flow)
Loaders.add(SCSS)
Loaders.add(LESS)
Loaders.add(Stylus)

const app = new Koa()

app.use(async (ctx, next) => {
    await next()
    const secFetchDest: string = ctx.headers['sec-fetch-dest']
    const originalMineType = ctx.response.type
    for (const loader of Loaders) {
        if (typeof loader.canHandle === 'string') {
            const _ = loader.canHandle
            loader.canHandle = async (mineType: string) => _ === mineType
        }
        let source: string
        async function getSource() {
            if (typeof source === 'undefined') return (source = await ReadStreamToString(ctx.body))
            return source
        }
        if (await loader.canHandle(originalMineType, getSource)) {
            if (secFetchDest === 'script' && loader.transformESModule) {
                ctx.body = await loader.transformESModule(await getSource(), ctx.request)
                ctx.response.type = '.js'
                break
            } else if (secFetchDest === 'document' && loader.transformHTML) {
                ctx.body = await loader.transformHTML(await getSource(), ctx.request)
                ctx.response.type = '.html'
                break
            } else if (secFetchDest === 'style' && loader.transformStyle) {
                ctx.body = await loader.transformStyle(await getSource(), ctx.request)
                ctx.response.type = '.css'
                break
            }
        }
    }
})
app.use(KoaStatic('./demo/', { hidden: true }))

app.listen(3000)

// Polyfill
globalThis.btoa = (str: string) => Buffer.from(str).toString('base64')
