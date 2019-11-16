import { SecFetchDest } from '../types'
import { ReadStream } from 'fs'

export interface LoaderContext {
    readonly path: string
    readonly originalUrl: string
    readonly serveBasePath: string
    readonly secFetchDest: SecFetchDest
    mineType: string
    readAsString(): Promise<string>
    readAsStream(): Promise<ReadStream>
}
export interface Loader {
    canHandle: string | ((mineType: string, ctx: LoaderContext) => boolean | Promise<boolean>)
    transformESModule?: (source: string, ctx: LoaderContext) => string | Promise<string>
    transformDocument?: (source: string, ctx: LoaderContext) => string | Promise<string>
    transformStyle?: (source: string, ctx: LoaderContext) => string | Promise<string>
    transform?: (ctx: LoaderContext) => Promise<string | ReadStream>
    redirectHandler?: (type: SecFetchDest, notFoundPath: string) => string[]
}

export const Loaders = new Set<Loader>()
