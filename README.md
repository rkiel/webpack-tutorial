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
console.log('hello world');
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

## We have to update HTML file `index.html`

```html
<!doctype html>
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <script src="./dist/hello.js"></script>
  </body>
</html>
```

## Commit again

    git add .
    git commit -m "named bundle entry point"

## Let's some more files

`src/utils/strings.js`

```javascript
export function magical(value) {
  return value.toUpperCase();
}
```

`src/hello.js`

```javascript
export function generate(name) {
  return `hello ${name}`;
}
```

`src/main.js`

```javascript
import * as hello from './hello';
import * as strings from './utils/strings';

const msg = hello.generate('bob');

console.log(msg);
console.log(strings.magical(msg));
```

## Now we need to change our entry point

```javascript
entry: {
  hello: './src/main.js'
},
```

## Run the build

    npm run build
    ls -l dist

## Let's add some lodash

    npm install --save lodash

## Let's use a lodash function

`src/utils/strings.js`

```javascript
import _ from 'lodash';

export function magical(value) {
  return _.toUpper(value);
}
```

## Run the build

    npm run build

## Look at `dist/hello.js`

Messy. All of lodash is there.

## Use an optimization to split code

Horrible documentation for Webpack 4.

```javascript
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
```

## We have to update HTML file `index.html`

```html
<!doctype html>
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <script src="./dist/vendor.js"></script>
    <script src="./dist/hello.js"></script>
  </body>
</html>
```

## Let's pull in some content from the web using Axios

    npm install --save axios

## Update our js

```javascript
import _ from 'lodash';
import axios from 'axios';

console.log(_.toUpper('hello world'));

async function loadUrl(url) {
  try {
    return await axios.get(url);
  } catch (e) {
    return e.message;
  }
}

async function main() {
  const url = 'http://goole.com';

  const content = await loadUrl(url);
  console.log('Content is ' + content);
}

main();
```

## Run the build

    npm run build
    cat dist/hello.js

## Install babel

    npm install --save-dev babel-core babel-loader babel-preset-env babel-polyfill

## Create .babelrc

```json
{
  "presets": [["env", { "modules": false }]]
}
```

## Add this to top of `hello.js`

```javascript
import 'babel-polyfill';
```

## Run the build

    npm run build
    cat dist/hello.js
