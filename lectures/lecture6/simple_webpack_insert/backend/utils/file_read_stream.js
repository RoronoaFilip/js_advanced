const fs = require('fs');

function createFileReadStream(path, res = null) {
    return fs.createReadStream(path, {encoding: 'utf-8', highWaterMark: 1024});
}

module.exports = {createFileReadStream};