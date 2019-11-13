import { ReadStream } from 'fs'
export async function ReadStreamToString(readable: ReadStream) {
    let result = ''
    for await (const chunk of readable) {
        result += chunk
    }
    return result
}
