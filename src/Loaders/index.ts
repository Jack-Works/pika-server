export interface Loader {
    canHandle: string
    transformESModule: (source: string) => string | Promise<string>
    transformHTML: (source: string) => string | Promise<string>
}

export const Loaders = new Set<Loader>()
