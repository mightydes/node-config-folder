const fs = require('fs');
const path = require('path');
const op = require('object-path');

class NodeConfigFolder {

    /**
     * @param options
     * @option {string} 'folder' -- mandatory
     */
    constructor(options = {}) {
        this.options = options;
        this._cache = {};
        this.getFileList().forEach((it) => {
            const name = it.file.substr(0, it.file.lastIndexOf('.'));
            this._cache[name] = require(path.join(it.dir, it.file));
        });
    }

    get(dotPath, defValue) {
        return op.get(this._cache, dotPath, defValue === undefined ? undefined : defValue);
    }

    set(dotPath, value) {
        return op.set(this._cache, dotPath, value);
    }

    del(dotPath) {
        return op.del(this._cache, dotPath);
    }

    has(dotPath) {
        return op.has(this._cache, dotPath);
    }

    /**
     * @private
     * @returns {*[]}
     */
    getFileList() {
        const dir = this.options.folder;
        let out = [];
        fs.readdirSync(dir).map((file) => out.push({dir: dir, file: file}));
        return out.filter((it) => fs.lstatSync(path.join(it.dir, it.file)).isFile());
    }

}

module.exports = NodeConfigFolder;
