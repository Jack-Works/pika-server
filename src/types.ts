/**
 * @see https://w3c.github.io/webappsec-fetch-metadata/#sec-fetch-dest-header
 *
 * In order to support forward-compatibility with as-yet-unknown request types,
 * servers SHOULD ignore this header if it contains an invalid value.
 */
export type SecFetchDest =
    | 'audio'
    | 'audioworklet'
    | 'document'
    | 'embed'
    | 'empty'
    | 'font'
    | 'image'
    | 'manifest'
    | 'object'
    | 'paintworklet'
    | 'report'
    | 'script'
    | 'serviceworker'
    | 'sharedworker'
    | 'style'
    | 'track'
    | 'video'
    | 'worker'
    | 'xslt'
    | 'nested-document'

export function isScriptLikeTarget(
    target: SecFetchDest,
): target is 'audioworklet' | 'paintworklet' | 'script' | 'serviceworker' | 'sharedworker' | 'worker' {
    switch (target) {
        case 'audioworklet':
        case 'paintworklet':
        case 'script':
        case 'serviceworker':
        case 'sharedworker':
        case 'worker':
            return true
        default:
            return false
    }
}
