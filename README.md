# @pika/server

A light server built for ES Modules.

```html
<!-- Load SCSS file directly -->
<link rel="stylesheet" href="./style.sass" />
<!-- ./src => ./src/index.ts -->
<script type="module" src="./src"></script>
<script type="module">
    // Load JSON Modules!
    import data from './package.json'
    import CSS from './global.css'
    // Apply the CSS to the DOM
    document.adoptedStylesheets = [CSS]
</script>
```

## Feature sets

### TL DR

-   Import as ESModules: ECMAScript, flow, TypeScript, CoffeeScript
-   Import as ESModules\*: CSS, JSON
-   Compile-while-serve: flow, TypeScript, CoffeeScript, Markdown, Less.js, SCSS, Stylus, JSONC, WebAssemblyText

### Import JavaScript-like types:

|                                | ECMAScript | flow | TypeScript | CoffeeScript |
| ------------------------------ | ---------- | ---- | ---------- | ------------ |
| Importable                     | ✔          | ✔\*  | ✔          | ✔            |
| SourceMap                      | ✔          | ✔    | ✔          | ✔            |
| Import without suffix          | ✔          | ✔    | ✔          | ✔            |
| JSX                            | ❌         | ❌   | ✔          | ❌           |
| import 'lodash'                | ❌         | ❌   | ✔          | ❌           |
| import('lodash')               | ❌         | ❌   | ✔          | ❌           |
| import '/node_modules/lodash'  | ✔          | ✔    | ✔          | ✔            |
| import('/node_modules/lodash') | ✔          | ✔    | ✔          | ✔            |

\*: you need to have a `@flow` mark to enable the flow compiler.

The support for `export {} from 'path'` is the same as `import {} from 'path'`.

### Import CSS-like types as CSS Module:

You can import a `.css` file as a [CSSStyleSheet](https://wicg.github.io/construct-stylesheets/index.html) object.

Reference: [CSS Module](https://github.com/w3c/webcomponents/issues/759).

|                           | CSS | Less.js | SCSS | Stylus |
| ------------------------- | --- | ------- | ---- | ------ |
| `<link>` loadable         | ✔   | ✔       | ✔    | ✔      |
| SourceMap (`<link>`)      | ✔   | ✔       | ✔    | ❌     |
| Import as CSSStyleSheet   | ✔   | ❌      | ❌   | ❌     |
| SourceMap (import)        | ❌  | ❌      | ❌   | ❌     |
| Their own `import` syntax | ✔   | ❌      | ❌   | ❌     |

### Import JSON-like types as JSON Module:

> TODO: support? yaml, toml, json5/6, cson

You can import a `.json` file.

Reference: [JSON Module](https://github.com/whatwg/html/issues/4315), [specification](https://whatpr.org/html/4407/38c50c4...2aa1aad/webappapis.html#creating-scripts)

> Caution: This spec is reverted due to security issue: [HTML, CSS, and JSON modules shouldn't solely rely on MIME type to change parsing behavior](https://github.com/w3c/webcomponents/issues/839)

|           | JSON | JSONC |
| --------- | ---- | ----- |
| ES Import | ✔    | ✔     |
| SourceMap | ❌   | ❌    |

### Import HTML-like types as HTML Module:

> TODO: support? html, pug, ejs

TBD. [HTML Module](https://github.com/w3c/webcomponents/issues/645).

### Import WebAssembly as ES Module:

You can import a `.wasm` file as a WebAssembly Module instance.

Reference: [WebAssembly Module](https://github.com/WebAssembly/esm-integration/tree/master/proposals/esm-integration)

|                               | .wasm | .wat/.wast |
| ----------------------------- | ----- | ---------- |
| Import as WebAssembly         | ✔     | ✔          |
| ES Import                     | ❌    | ❌         |
| SourceMap (import)            | ❌    | ❌         |
| ES Import w/o Top-Level await | ❌    | ❌         |

### Notes:

##### Import without suffix:

-   ECMAScript
    -   Same as flow
-   flow
    -   \$.js
    -   \$/index.js
    -   \$.mjs
    -   \$/index.mjs
-   TypeScript
    -   \$.tsx
    -   \$.ts
    -   \$/index.tsx
    -   \$/index.ts
-   CoffeeScript
    -   \$.coffee
