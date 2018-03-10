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

## Create a Hello World script file

    mkdir -p src
    vim src/hello.js

```javascript
console.log('hello world');
```

## Create an HTML file

    vim index.html

Assume that we want to load our JavaScript from a `dist` directory.

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

Obviously this fails because `dist/bundle.js` does not exist.

```
index.html:7 GET file:///webpack-tutorial/dist/bundle.js net::ERR_FILE_NOT_FOUND
```

Let's use `webpack` to create it.

## Install `webpack`

    npm install --save-dev webpack webpack-cli

## Create the default `webpack` configuration file

    vim webpack.config.js

## Start with an empty shell

```javascript
module.exports = {};
```

## Add an entry point for the first file of our source code

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

## Add `webpack` as the default npm build script

    vim package.json

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

## Run build

    npm run build
    ls -l dist
    cat dist/bundle.js

You should see `dist/bundle.js`

## Commit your changes

    echo dist >> .gitignore
    git add .
    git commit -m "A basic config"

## Now deeper with bundles

From the Webpack documentation:

> At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it recursively builds a dependency graph that includes every module your application needs, then packages all of those modules into one or more bundles.

## Make the webpack config more generic

    vim webpack.config.js

Replace the entry string with an object. Give the bundle the name `hello`.

```javascript
entry: {
  hello: './src/hello.js';
}
```

Replace the hard coded filename `bundle.js` with a placeholder for the bundle name used in entry.

```javascript
output: {
  filename: '[name].js',
  path: path.resolve(__dirname, 'dist')
}
```

## Build again

    npm run build
    ls -l dist

You should see `dist/hello.js`.

But I also see `dist/bundle.js`. We need to purge `dist` before each build.

### Update our default build

    vim package.json

Purge `dist` before running Webpack

```json
"scripts": {
  "build": "rm -rf dist && webpack"
}
```

## Build again

    npm run build
    ls -l dist

## We have to update the HTML file

    vim index.html

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

## Nobody uses just one file. Let's add more.

    mkdir -p src/utils
    vim src/utils/strings.js

```javascript
export function magical(value) {
  return value.toUpperCase();
}
```

    vim src/hello.js

```javascript
export function generate(name) {
  return `hello ${name}`;
}
```

    vim src/main.js

```javascript
import * as hello from './hello';
import * as strings from './utils/strings';

const msg = hello.generate('bob');

console.log(msg);
console.log(strings.magical(msg));
```

## Now we need to change our entry point

    vim webpack.config.js

```javascript
entry: {
  hello: './src/main.js'
},
```

## Run the build

    npm run build
    ls -l dist

## Nobody writes all their own code. Let's add a third-party library.

    npm install --save lodash

## Let's use a lodash function

    vim src/utils/strings.js

```javascript
import _ from 'lodash';

export function magical(value) {
  return _.toUpper(value);
}
```

## Run the build

    npm run build
    cat dist/hello.js

Messy. All that lodash code is there.

## Use an optimization to split code

Horrible documentation for Webpack 4.

Split code into two bundles. Our code and external libraries.

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

## We have to update HTML file

    vim  index.html

Include the new `vendor` bundle.

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

## Nobody sits quietly. Let's pull in some content from the web using Axios

    npm install --save axios

## Create a web util

    vim  src/utils/web.js

And let's use the fancy new ES2017 async/await form of Promises.

```javascript
import axios from 'axios';

async function loadUrl(url) {
  try {
    return await axios.get(url);
  } catch (e) {
    return e.message;
  }
}

export async function get(url) {
  const content = await loadUrl(url);
  console.log('Content is ' + content);
}
```

## Use our new get function

    vim src/main.js

```javascript
import * as hello from './hello';
import * as strings from './utils/strings';
import * as web from './utils/web';

const msg = hello.generate('bob');

console.log(msg);
console.log(strings.magical(msg));

web.get('http://goole.com');
```

## Run the build

    npm run build

## Why does this work?

    cat dist/hello.js

## Let's use universal ES5 JavaScript. Install babel

    npm install --save-dev babel-core babel-loader babel-preset-env babel-polyfill

## Create a babel configuration file

    vim .babelrc

```json
{
  "presets": ["env"]
}
```

## Babel needs something loaded at program start

    vim main.js

```javascript
import 'babel-polyfill';
```

## Run the build

    npm run build
    cat dist/hello.js
