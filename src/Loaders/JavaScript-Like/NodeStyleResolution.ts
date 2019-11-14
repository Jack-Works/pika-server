export function nodeStyleResolution(path: string) {
    if (path.startsWith('./') || path.startsWith('../') || path.startsWith('/')) return path

    return `https://unpkg.com/${path}?module`

    // const [moduleOrNS, pathOrModule, ...paths] = path.split('/')
    // const nsImport = moduleOrNS.startsWith('@')

    // const namespace = nsImport ? moduleOrNS : undefined
    // const moduleName = nsImport ? pathOrModule : moduleOrNS

    // const fullModuleName = [namespace, moduleName].filter(x => x).join('/')

    // if (!nsImport) paths.unshift(pathOrModule)
    // const packageJson = fetch(`https://unpkg.com/${fullModuleName}/package.json`)
    // if (paths.length === 0) return `https://unpkg.com/${fullModuleName}?module`
    // return `https://unpkg.com/${fullModuleName}/${paths.join('/')}?module`
}
