#!/usr/bin/env node
import Koa from 'koa'
import KoaStatic from 'koa-static'
import { Loaders, LoaderContext } from './Loaders'
import { ReadStreamToString } from './utils/ReadStreamToString'

import { exists } from 'fs'
import { promisify } from 'util'
import { join } from 'path'
import { resolveNpmNamespace, nodeStyleResolution } from './Loaders/JavaScript-Like/NodeStyleResolution'

import JSONLoader from './Loaders/JSONModule'
import MarkdownLoader from './Loaders/MarkdownLoader'
import CSSModule from './Loaders/CSS-Like/CSSModule'
import TypeScript from './Loaders/JavaScript-Like/TypeScript'
import CoffeeScript from './Loaders/JavaScript-Like/CoffeeScript'
import Flow from './Loaders/JavaScript-Like/Flow'
import SCSS from './Loaders/CSS-Like/SCSS'
import LESS from './Loaders/CSS-Like/LESS'
import Stylus from './Loaders/CSS-Like/Stylus'
import WebAssembly from './Loaders/WebAssembly'

Loaders.add(CSSModule)
Loaders.add(JSONLoader)
Loaders.add(TypeScript)
Loaders.add(MarkdownLoader)
Loaders.add(CoffeeScript)
Loaders.add(Flow)
Loaders.add(SCSS)
Loaders.add(LESS)
Loaders.add(Stylus)
Loaders.add(WebAssembly)

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
        async function readSource() {
            if (typeof source === 'undefined') return (source = await ReadStreamToString(ctx.body))
            return source
        }
        const loaderCtx: LoaderContext = {
            serveBasePath: demoPath,
            originalUrl: ctx.originalUrl,
            path: ctx.path,
            readAsString: readSource,
            setMineType(type) {
                ctx.response.type = type
            },
        }
        if (await loader.canHandle(originalMineType, loaderCtx)) {
            if (secFetchDest === 'script' && loader.transformESModule) {
                ctx.body = await loader.transformESModule(await readSource(), loaderCtx)
                ctx.response.type = '.js'
                break
            } else if (secFetchDest === 'document' && loader.transformHTML) {
                ctx.body = await loader.transformHTML(await readSource(), loaderCtx)
                ctx.response.type = '.html'
                break
            } else if (secFetchDest === 'style' && loader.transformStyle) {
                ctx.body = await loader.transformStyle(await readSource(), loaderCtx)
                ctx.response.type = '.css'
                break
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
})

const demoPath = './demo/'

app.use(KoaStatic(demoPath, { hidden: true }))

const exist = promisify(exists)
/**
 * Re-resolve path like folder import
 */
app.use(async (ctx, next) => {
    if (ctx.response.status === 404) {
        const secFetchDest: any = ctx.headers['sec-fetch-dest']
        searching: for (const loader of Loaders) {
            if (!loader.redirectHandler) continue
            for (const path of loader.redirectHandler(secFetchDest, ctx.path)) {
                if (await exist(join(demoPath, path))) {
                    ctx.redirect(path)
                    break searching
                }
            }
        }
    }
    return next()
})

/**
 * Re-resolve node_modules path
 */
app.use(async (ctx, next) => {
    if (ctx.response.status === 404) {
        const secFetchDest: any = ctx.headers['sec-fetch-dest']
        if (secFetchDest === 'script' && ctx.path.startsWith('/node_modules/')) {
            const { subPath, fullModuleName } = resolveNpmNamespace(ctx.path.replace('/node_modules/', ''), demoPath)
            if (subPath === '') ctx.redirect(nodeStyleResolution(fullModuleName, demoPath))
        }
    }
    return next()
})

app.listen({ port: 5000 })

// Polyfill
globalThis.btoa = (str: string) => Buffer.from(str).toString('base64')
