import Koa from 'koa'
export interface Loader {
    canHandle: string
    transformESModule?: (source: string, req: Koa.Request) => string | Promise<string>
    transformHTML?: (source: string) => string | Promise<string>
}

export const Loaders = new Set<Loader>()
