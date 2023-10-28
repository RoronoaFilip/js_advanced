const config = require('../config.json');
const http = require('http');
const path = require('path');
const fs = require('fs');

const pagesHandlers = {
    main: handleMainPage
};

const methodHandlers = {
    GET: handleGetRequest,
    POST: handlePostRequest
};

const errorHandlers = {
    ENOENT: notFoundHandler
};

const responseMessages = {
    NOT_FOUND: 'Content Not Found',
    INTERNAL_SERVER: 'Internal Server Error',
    OK: 'Operation Successful'
};

const responseCodes = {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500
};

const server = http.createServer(function serverHandler(req, res) {
    const requestMethod = req.method.toUpperCase();

    const handler = methodHandlers[requestMethod] || responseHandlers.NOT_FOUND;

    handler(req, res);
});

server.listen(config.port, function (err) {
    if (err) {
        console.error(err);
        return;
    }

    console.log('Server is listening on :' + config.port);
});

function handleGetRequest(req, res) {
    const parsedPath = path.parse(req.url);

    const handlerFunction = pagesHandlers[parsedPath.name] || responseHandlers.NOT_FOUND;
    handlerFunction(req, res);
}

function handlePostRequest(req, res) {
    responseHandlers.OK(req, res, true);
}

const responseHandlers = {
    OK: okHandler,
    NOT_FOUND: notFoundHandler,
    INTERNAL_SERVER: serverErrorHandler
};

function okHandler(req, res, end = true, contentToWrite = null) {
    res.writeHead(responseCodes.OK);
    res.write(contentToWrite || responseMessages.OK);

    if (end) {
        res.end();
    }
}

function notFoundHandler(req, res, end = true, contentToWrite = null) {
    res.writeHead(responseCodes.NOT_FOUND);
    res.write(contentToWrite || responseMessages.NOT_FOUND);

    if (end) {
        res.end();
    }
}

function serverErrorHandler(req, res, end = true, contentToWrite = null) {
    res.writeHead(responseCodes.INTERNAL_SERVER);
    res.write(contentToWrite || responseMessages.INTERNAL_SERVER);

    if (end) {
        res.end();
    }
}

function handleMainPage(req, res) {
    function handleError(err) {
        if (err) {
            const errorCode = err.code.toUpperCase();
            const errorHandlerFunction = errorHandlers[errorCode] || responseHandlers.INTERNAL_SERVER;
            errorHandlerFunction(req, res);
        }
    }

    fs.readFile('../pages/main.html', function afterReadHandler(err, htmlBuffer) {
        handleError(err);

        fs.readFile('../pages/main.css', function afterStyleReadHandler(err, cssBuffer) {
            handleError(err);

            const htmlAsString = htmlBuffer.toString();
            const cssAsString = cssBuffer.toString();

            const styledHtmlAsString = htmlAsString.replace('</head>', `<style>\n${cssAsString}\n</style>\n</head>`);

            responseHandlers.OK(req, res, true, styledHtmlAsString);
        });
    });
}