export interface LoaderContext {
    path: string
    originalUrl: string
    serveBasePath: string
    setMineType(type: string): void
    readAsString(): Promise<string>
}
export interface Loader {
    canHandle: string | ((mineType: string, ctx: LoaderContext) => Promise<boolean>)
    transformESModule?: (source: string, req: LoaderContext) => string | Promise<string>
    transformHTML?: (source: string, req: LoaderContext) => string | Promise<string>
    transformStyle?: (source: string, req: LoaderContext) => string | Promise<string>
    redirectHandler?: (type: 'script' | 'document' | 'style', notFoundPath: string) => string[]
}

export const Loaders = new Set<Loader>()
