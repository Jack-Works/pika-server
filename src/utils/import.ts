import { exec } from 'child_process'
import { promisify } from 'util'
import { exists } from 'fs'
import { normalize } from 'path'

const exe = promisify(exec)
const test = promisify(exists)

export function importGlobal<T>(src: string): Promise<T> {
    return import(src)
        .catch(() => resolveNPM(src))
        .catch(() => resolveYarn(src))
        .then(x => x.default || x)
}

async function resolveNPM(_: string) {
    const path = normalize((await exe('npm root -g')).stdout.toString().trim() + '/' + _)
    return import_(path)
}
async function resolveYarn(_: string) {
    const path = normalize((await exe('yarn global dir')).stdout.toString().trim() + '/node_modules/' + _)
    return import_(path)
}

async function import_(pkg: string) {
    if (await test(normalize(pkg + '/package.json'))) return import(pkg)
    else throw new Error('Package not found')
}
