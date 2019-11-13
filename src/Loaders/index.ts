import Koa from 'koa'
import { ReadStream } from 'fs'
export interface Loader {
    canHandle: string | ((mineType: string, getSource: () => Promise<string>) => Promise<boolean>)
    transformESModule?: (source: string, req: Koa.Request) => string | Promise<string>
    transformHTML?: (source: string) => string | Promise<string>
}

export const Loaders = new Set<Loader>()
