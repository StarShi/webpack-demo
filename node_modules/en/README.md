env
===

Creates a global `env` function object. Just to be terse.

```javascript
require("en");

console.log(env.development);
//true
console.log(env.production);
//undefined

console.log(env('development'));
//true

console.log(env('Your env is: ' + env));
//Your env is: development

```


To set the current `env`, use the standard `NODE_ENV` environment variable.

```
$ NODE_ENV=production node app.js
```


License
=======
MIT
