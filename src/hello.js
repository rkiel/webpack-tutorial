import 'babel-polyfill';
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
