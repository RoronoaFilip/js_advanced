const fs = require('fs');
const {Transform} = require('stream');

const readStream = fs.createReadStream('./source.txt', {encoding: 'utf8', highWaterMark: 5});
const writeStream = fs.createWriteStream('./output.txt', {encoding: 'utf8'});

const replacementMap = {
    someValue: 'HELLO WORLD!',
    OOO: '123'
};

function transformText(replacementMap, targetString) {
    for (const key in replacementMap) {
        const regex = new RegExp(key, 'g');
        const replacement = replacementMap[key];
        targetString = targetString.replace(regex, replacement);
    }
    return targetString;
}

const transformStream = new Transform({
    encoding: 'utf8',
    buffer: '',
    transform(chunk, encoding, cb) {
        const chunkString = chunk.toString();
        this.buffer = (this.buffer || '') + chunkString;

        if (chunkString.includes('\n')) {
            const lines = this.buffer.split('\n');
            this.buffer = lines.pop();

            for (const i in lines) {
                this.push(transformText(replacementMap, lines[i]) + '\n');
            }
        }

        return cb();
    },
    flush(cb) {
        if (this.buffer) {
            const transformedLine = transformText(replacementMap, this.buffer);
            this.push(transformedLine);
        }
        return cb();
    }
});


readStream.pipe(transformStream).pipe(writeStream);