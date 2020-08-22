declare module 'es-dev-server' {
    import { Middleware } from 'koa'
    import { FSWatcher } from 'chokidar'
    const config: unique symbol
    export interface Config {
        watch: boolean
        http2: boolean
        compatibility: 'auto' | 'always' | 'min' | 'max' | 'none'
        'node-resolve': boolean
        dudupe: boolean | string[]
        'preserve-symlinks': boolean
        'module-dirs': string | string[]
        babel: boolean
        'root-dir': string
        'base-path': string
    }
    export function createConfig(conf: Partial<Config>): typeof config
    export function createMiddlewares(_config: typeof config, fw: FSWatcher): Middleware[]
    export function createServer(): void
    export function startServer(): void
}
