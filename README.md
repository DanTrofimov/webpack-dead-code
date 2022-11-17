## `DeadcodePlugin` for Webpack

## About
Plugin finds dead code in your project trying compare modules used at Webpack bundle with file system.

## Setup demo

Install dependencies
```bash
npm istall
```

Build demo app from `./src/*`

```bash
npm run build
```

See generated `unused.json` - it will contain potential dead code from your project

## Add and configure plugin

Add into your `webpack.config.ts` DeadcodePlugin and pass config options:

```js
const config: webpack.Configuration = {
    ...
    plugins: [
        new DeadcodePlugin(options),
    ],
    ...
}
```

options is an object of type `PluginOptions`:
```js
type PluginOptions = {
    outputFile: string, // 'unused.json' by default
    rootDir: string // 'src' by default
}
```

## See
- https://webpack.js.org/contribute/writing-a-plugin/
- https://webpack.js.org/api/compiler-hooks/
- https://webpack.js.org/api/stats/