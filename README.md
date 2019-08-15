# node-config-folder
Load all js or json files from a directory

---

## Usage

```js
const path = require('path');
const NodeConfigFolder = require('node-config-folder');

const config = new NodeConfigFolder({
    folder: path.resolve(`${__dirname}/config`)
});

config.get('app.domain');
config.set('app.key', 'strong-key');
config.del('app.key');
config.has('app.key');
```

---
