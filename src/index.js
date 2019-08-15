const fs = require('fs');
const path = require('path');
const op = require('object-path');

class NodeConfigFolder {

    /**
     * @param options
     * @option {string} 'folder' -- mandatory
     * @option {Array} 'allowedExt'
     */
    constructor(options = {}) {
        this.options = Object.assign({
            allowedExt: ['js', 'json', 'ts']
        }, options);
        this._cache = {};
        this.handleFolder(this.options.folder, []);
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
     * @param {string} basePath
     * @param {Array} prev
     */
    handleFolder(basePath, prev) {
        const folder = path.join(basePath, ...prev);
        const stat = this.statFolder(folder);
        stat.map((it) => {
            if (it.isFile) {
                const info = this.parseFile(it.file);
                if (this.options.allowedExt.indexOf(info.ext) > -1) {
                    op.set(
                        this._cache,
                        [...prev].concat([info.name]),
                        require(path.join(it.dir, it.file))
                    );
                }
            } else { // isDirectory:
                this.handleFolder(basePath, [...prev].concat([it.file]));
            }
        });
    }

    /**
     * @private
     * @param {string} dir
     * @returns {Array}
     */
    statFolder(dir) {
        let out = [];
        fs.readdirSync(dir).map((file) => out.push({
            dir: dir,
            file: file,
            isFile: fs.lstatSync(path.join(dir, file)).isFile()
        }));
        return out;
    }

    /**
     * @private
     * @param {string} file
     * @returns {{ext: string, name: string}}
     */
    parseFile(file) {
        const dotIx = file.lastIndexOf('.');
        if (dotIx < 0) {
            return {name: file, ext: ''};
        }
        return {
            name: file.substr(0, dotIx),
            ext: file.substr(dotIx + 1)
        }
    }

}

module.exports = NodeConfigFolder;
