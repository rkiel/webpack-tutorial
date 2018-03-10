import 'babel-polyfill';

import * as hello from './hello';
import * as strings from './utils/strings';
import * as web from './utils/web';

const msg = hello.generate('bob');

console.log(msg);
console.log(strings.magical(msg));

web.get('http://goole.com');
