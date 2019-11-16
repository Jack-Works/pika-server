async function main() {
    // @ts-ignore
    const monaco = await (import('monaco-editor') as Promise<typeof import('../node_modules/monaco-editor')>)

    monaco.editor.create(document.getElementById('container'), {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript',
        theme: matchMedia(`prefers-color-scheme: dark`) ? 'vs-dark' : 'vs',
    })
}
main()
