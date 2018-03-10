# Webpack tutorial

This tutorial is based on the [Webpack Getting Started](https://webpack.js.org/guides/getting-started/) tutorial.

## Create a new project

    mkdir webpack-tutorial
    cd webpack-tutorial

## Prepare to use `npm` modules

    npm init -y
    echo node_modules >> .gitignore

## Initial commit

    touch README.md
    git init
    git add .
    git commit -m "Initial commit”

## Install `webpack`

    npm install --save-dev webpack
    npm install --save-dev webpack-cli

## Create a source code directory

    mkdir -p src

## Create a Hello World script file `src/hello.js`

```javascript
console.log('Hello World');
```

## Create an HTML file `index.html`

```html
<!doctype html>
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <script src="./dist/bundle.js"></script>
  </body>
</html>
```

## Open `file:///webpack-tutorial/index.html`

```
index.html:7 GET file:///webpack-tutorial/dist/bundle.js net::ERR_FILE_NOT_FOUND
```

## Create `webpack.config.js`

    touch webpack.config.js

## Start with an empty shell

```javascript
module.exports = {};
```

## Add an entry point for source code

Entry points can be relative path.

```javascript
module.exports = {
  entry: './src/hello.js'
};
```

## Add an output

Output has to be a fully qualified path.

```javascript
const path = require('path');

module.exports = {
  entry: './src/hello.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

## Add scripts to package.json

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

## Run webpack

    npm run webpack

## Look in `dist`

You should see `dist/bundle.js`

## Commit your changes

    echo dist >> .gitignore
    git add .
    git commit -m "A basic config"

## Now to bundles

From the Webpack documentation:

> At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it recursively builds a dependency graph that includes every module your application needs, then packages all of those modules into one or more bundles.

## Change `webpack.config.js`

Replace the entry string with an object. Give the bundle the name `hello`.

```javascript
entry: {
  hello: './src/hello.js';
}
```

Replace the hard coded filename `bundle` with a placeholder for the bundle name used in entry.

```javascript
output: {
  filename: '[name].js',
  path: path.resolve(__dirname, 'dist')
}
```

## Build again

    npm run webpack

You should see `dist/hello.js`. But I also see `dist/bundle.js`. We need to purge `dist` before each build.

### Update package.json

```json
"scripts": {
  "build": "rm -rf dist && webpack"
}
```

## Commit again

    git add .
    git commit -m "named bundle entry point"
