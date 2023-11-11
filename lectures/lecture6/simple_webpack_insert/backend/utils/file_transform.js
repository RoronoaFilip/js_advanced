const {Transform} = require('stream');
const {transformText} = require('./transform_text');

function createTransformStream(replacementMap) {
    replacementMap = replacementMap || {};
    return new Transform({
        encoding: 'utf8',
        buffer: '',
        transform(chunk, encoding, cb) {
            const chunkString = chunk.toString();
            this.buffer = (this.buffer || '') + chunkString;

            if (this.buffer.includes('\n')) {
                const lines = this.buffer.split('\n');
                this.buffer = lines.pop();

                for (const i in lines) {
                    this.push(transformText(replacementMap, lines[i]) + '\n');
                }

                return cb();
            }

            return cb();
        },
        flush(cb) {
            if (this.buffer) {
                const transformedLine = transformText(replacementMap, this.buffer);
                this.push(transformedLine);
            }
            replacementMap = {};
            return cb();
        }
    });
}

module.exports = {createTransformStream};