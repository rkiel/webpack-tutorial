import * as hello from './hello';
import * as strings from './utils/strings';

const msg = hello.generate('bob');

console.log(msg);
console.log(strings.magical(msg));
