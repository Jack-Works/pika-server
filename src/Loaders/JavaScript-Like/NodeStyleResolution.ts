import { readFileSync } from 'fs'
import { join, posix } from 'path'

export function nodeStyleResolution(path: string, base: string) {
    if (path.startsWith('./') || path.startsWith('../') || path.startsWith('/')) return path

    const { fullModuleName, packageBase } = resolveNpmNamespace(path, base)

    try {
        const packageJSON: unknown = JSON.parse(readFileSync(join(packageBase, 'package.json'), 'utf-8'))
        if (typeof packageJSON !== 'object') throw new Error('Invalid package json type')
        const esModuleEntry = (packageJSON as any).module || (packageJSON as any).main
        return posix.join('/node_modules', fullModuleName, esModuleEntry)
    } catch {
        return `https://unpkg.com/${fullModuleName}?module`
    }
}
export function resolveNpmNamespace(path: string, base: string) {
    const [moduleOrNS, pathOrModule, ...paths] = path.split('/')
    const nsImport = moduleOrNS.startsWith('@')

    const namespace = nsImport ? moduleOrNS : undefined
    const moduleName = nsImport ? pathOrModule : moduleOrNS

    const fullModuleName = [namespace, moduleName].filter(x => x).join('/')

    if (!nsImport) paths.unshift(pathOrModule)
    return {
        fullModuleName,
        namespace,
        moduleName,
        subPath: paths.join('/'),
        packageBase: posix.join(base, '/node_modules/', fullModuleName),
    }
}
