#!/usr/bin/env node
import Koa from 'koa'
import KoaStatic from 'koa-static'
import { Loaders } from './Loaders'

import { exists } from 'fs'
import { promisify } from 'util'

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
import { PikaContext } from './types'
import MonacoMiddleware from './features/monaco'
import { PikaLoader } from './features/PikaLoader'
import { loaderRedirectHandler } from './features/loaderRedirectHandler'
import { nodeModuleCache } from './features/nodeModuleCache'
import { nodeStyleResolutionMiddleware } from './features/nodeStyleResolutionMiddleware'

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

export const exist = promisify(exists)
const demoPath = './demo/'

const app = new Koa()
app.use<{}, PikaContext>(async (ctx, next) => {
    ctx.serveRoot = demoPath
    ctx.servePath = ctx.path
    return next()
})

app.use(PikaLoader)
app.use(MonacoMiddleware)
app.use(loaderRedirectHandler)
app.use(nodeModuleCache)
app.use(nodeStyleResolutionMiddleware)
app.use(KoaStatic(demoPath, { hidden: true }))
app.listen({ port: 5000 })

// Polyfill
globalThis.btoa = (str: string) => Buffer.from(str).toString('base64')
