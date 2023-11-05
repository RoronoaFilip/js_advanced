const config = require('./config.json');
const http = require('http');
const path = require('path');
const fs = require('fs');
const {Transform} = require('stream');

const pagesHandlers = {
    main: handlePage
};

const methodHandlers = {
    GET: handleGetRequest,
    POST: handlePostRequest
};

const errorHandlers = {
    ENOENT: notFoundHandler
};

const responseHandlers = {
    NOT_FOUND: notFoundHandler,
};

const responseMessages = {
    NOT_FOUND: 'Content Not Found',
    INTERNAL_SERVER: 'Internal Server Error',
    OK: 'Operation Successful'
};

const responseCodes = {
    CONTINUE: 100,
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500
};

let body = [];
let replacementMap = {};

const server = http.createServer(function serverHandler(req, res) {
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        replacementMap = JSON.parse(Buffer.concat(body).toString() || '{}');
        body = [];
    });

    const requestMethod = req.method.toUpperCase();
    const handler = methodHandlers[requestMethod] || responseHandlers.NOT_FOUND;

    handler(req, res);
}).listen(config.port, function (err) {
    if (err) {
        console.error(err);
        return;
    }

    console.log('Server is listening on :' + config.port);
});

function handleGetRequest(req, res) {
    const parsedPath = path.parse(req.url);

    const handlerFunction = pagesHandlers[parsedPath.name] || responseHandlers.NOT_FOUND;
    handlerFunction(req, res, parsedPath.name);
}

function handlePostRequest(req, res) {
    const parsedPath = path.parse(req.url);

    const handlerFunction = pagesHandlers[parsedPath.name] || responseHandlers.NOT_FOUND;
    handlerFunction(req, res, parsedPath.name);
}

function notFoundHandler(req, res, end = true, contentToWrite = null) {
    res.writeHead(responseCodes.NOT_FOUND);
    res.write(contentToWrite || responseMessages.NOT_FOUND);

    if (end) {
        res.end();
    }
}

function handlePage(req, res, pageName) {
    function handleError(err) {
        if (err) {
            const errorCode = err.code.toUpperCase();
            const errorHandlerFunction = errorHandlers[errorCode] || responseHandlers.INTERNAL_SERVER;
            errorHandlerFunction(req, res);
        }
    }

    const transformStream = createTransformStream(pageName);

    const mainPageReadStream = fs.createReadStream(`./pages/${pageName}.html`, {encoding: 'utf-8', highWaterMark: 7})
        .on('error', handleError);

    transformStream.cssFilePath = `./pages/${pageName}.css`;
    mainPageReadStream.pipe(transformStream).pipe(res);
}

function transformText(replacementMap, targetString) {
    for (const key in replacementMap) {
        const regex = new RegExp('{{' + key + '}}', 'g');
        const replacement = replacementMap[key];
        targetString = targetString.replace(regex, replacement);
    }
    return targetString;
}

function createTransformStream(pageName) {
    const transformStream = new Transform({
        encoding: 'utf8',
        buffer: '',
        transform(chunk, encoding, cb) {
            const chunkString = chunk.toString();
            this.buffer = (this.buffer || '') + chunkString;

            if (this.buffer.includes('\n')) {
                this.handleCssFile();

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
            replacementMap = {};
            return cb();
        }
    });

    transformStream.handleCssFile = function handleCssFile() {
        if (!this.buffer.includes('<style>')) {
            return;
        }

        this.buffer = this.buffer.replace('<style>', `<style>${fs.readFileSync(this.cssFilePath)}`);
    };

    transformStream.cssFilePath = `./pages/${pageName}.css`;

    return transformStream;
}