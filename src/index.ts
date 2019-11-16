#!/usr/bin/env node
import Koa from 'koa'
import KoaStatic from 'koa-static'
import { Loaders, LoaderContext } from './Loaders'
import { ReadStreamToString } from './utils/ReadStreamToString'

import { exists, ReadStream } from 'fs'
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
import { SecFetchDest, isScriptLikeTarget as isScriptLikeDest } from './types'

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

const demoPath = './demo/'

app.use(async (ctx, next) => {
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
            serveBasePath: demoPath,
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
})

const exist = promisify(exists)
/**
 * Re-resolve path like folder import
 */
app.use(async (ctx, next) => {
    if (ctx.response.status === 404) {
        const secFetchDest: SecFetchDest = ctx.headers['sec-fetch-dest']
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
 * Cache for node_modules
 */
app.use(async (ctx, next) => {
    await next()
    if (ctx.path.startsWith('/node_modules/') && ctx.response.status < 400) {
        ctx.set('Cache-Control', 'public immutable max-age=604800')
    }
})

/**
 * Re-resolve node_modules path
 */
app.use(async (ctx, next) => {
    if (ctx.response.status === 404) {
        const secFetchDest: SecFetchDest = ctx.headers['sec-fetch-dest']
        if (isScriptLikeDest(secFetchDest) && ctx.path.startsWith('/node_modules/')) {
            const { subPath, fullModuleName } = resolveNpmNamespace(ctx.path.replace('/node_modules/', ''), demoPath)
            if (subPath === '') ctx.redirect(nodeStyleResolution(fullModuleName, demoPath))
        }
    }
    return next()
})

app.use(KoaStatic(demoPath, { hidden: true }))

app.listen({ port: 5000 })

// Polyfill
globalThis.btoa = (str: string) => Buffer.from(str).toString('base64')
