import Koa from 'koa'
export interface Loader {
    canHandle: string | ((mineType: string, getSource: () => Promise<string>) => Promise<boolean>)
    transformESModule?: (source: string, req: Koa.Request) => string | Promise<string>
    transformHTML?: (source: string, req: Koa.Request) => string | Promise<string>
    transformStyle?: (source: string, req: Koa.Request) => string | Promise<string>
}

export const Loaders = new Set<Loader>()
