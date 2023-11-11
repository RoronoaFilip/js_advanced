import { Transform } from "stream";
import fs from "fs";
import { transformText } from "./transform_text";


function createTransformStream(pageName, replacementMap) {
    const transformStream = new Transform({
        encoding: 'utf8',
        buffer: '',
        transform(chunk, encoding, cb) {
            const chunkString = chunk.toString();
            this.buffer = (this.buffer || '') + chunkString;

            if (this.buffer.includes('<style>')) {
                this.handleCssFile(cb);
            } else if (this.buffer.includes('\n')) {
                const lines = this.buffer.split('\n');
                this.buffer = lines.pop();

                for (const i in lines) {
                    this.push(transformText(replacementMap, lines[i]) + '\n');
                }

                return cb();
            } else {
                return cb();
            }
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

    transformStream.handleCssFile = function handleCssFile(cb) {
        let splitBuffer = this.buffer.split('<style>');
        this.push(splitBuffer[0] + '<style>');

        let transformStream = this;
        const cssStream = fs.createReadStream('pages/main.css',
            {highWaterMark: 1024, encoding: 'utf8'})
            .on('data', function readChunk(chunk) {
                transformStream.push(chunk);
            })
            .on('end', function callCb() {
                cb();
            });

        this.buffer = splitBuffer[1] || '';
    };

    transformStream.cssFilePath = `./pages/${pageName}.css`;

    return transformStream;
}

module.exports = {createTransformStream}