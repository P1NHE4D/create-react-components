const fs = require('fs');
const path = require('path');

/**
 * Based on: https://github.com/enb/enb-stylus/blob/master/test/lib/mock-fs-helper.js
 * Duplicate of the real file system for passed dir, used for mock fs for tests
 * @param {String} dir – filename of directory (full path to directory)
 * @returns {Object} - object with duplicating fs
 */
export function duplicateFSInMemory(dir: string) {
    let obj: {[file: string]: any} = {};

    fs.readdirSync(dir).forEach(function (basename: string) {
        const filename = path.join(dir, basename);
        const stat = fs.statSync(filename);

        if (stat.isDirectory()) {
            processDir(obj, dir, basename);
        } else {
            obj[basename] = readFile(filename);
        }
    });

    return obj;
}

/**
 * Function to traverse the directory tree
 */
function processDir(obj: any, root: string, dir: string) {
    const dirname = dir ? path.join(root, dir) : root,
        name = dir || root,
        additionObj: {[file: string]: any} = obj[name] = {};

    fs.readdirSync(dirname).forEach(function (basename: string) {
        const filename = path.join(dirname, basename);
        const stat = fs.statSync(filename);

        if (stat.isDirectory()) {
            processDir(additionObj, dirname, basename);
        } else {
            additionObj[basename] = readFile(filename);
        }
    });
}

/**
 * Reads the given file
 */
function readFile(filename: string) {
    const ext = path.extname(filename);

    if (['.gif', '.png', '.jpg', '.jpeg', '.svg'].indexOf(ext) !== -1) {
        return fs.readFileSync(filename);
    }

    return fs.readFileSync(filename, 'utf-8');
}