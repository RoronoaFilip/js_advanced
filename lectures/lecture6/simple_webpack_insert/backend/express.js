const express = require('express');
const cors = require('cors');
const {generateHexColors} = require('./utils/generate_random_hex_colors');
const {createFileReadStream} = require('./utils/file_read_stream');
const {createTransformStream} = require('./utils/file_transform');
const {responseHandlers} = require('./utils/response_handlers');


const app = express();
const port = 8080;
app.listen(port, function () {
    console.log('Server is listening on port 8080');
});

app.use(cors());

app.get('/test', function (req, res) {
    console.log('url is test');
    res.write('Hello World');
    res.end();
});

app.get('/user', function (req, res) {
    res.write('All Users');
    res.end();
});

app.get('/user/:id', function (req, res) {
    const id = req.params.id;
    res.write('Here is ID: ' + id);
    res.end();
});

app.get('/sdk', function (req, res) {
    const filePath = '../dist/bundle.js';

    const readStream = createFileReadStream(filePath, res)
        .on('error', function (err) {
            responseHandlers.INTERNAL_SERVER(req, res, err.message, true);
        });

    const transformStream = createTransformStream()
        .on('error', function (err) {
            responseHandlers.INTERNAL_SERVER(req, res, err.message, true);
        });

    res.setHeader('Content-Type', 'application/javascript');

    readStream.pipe(transformStream).pipe(res);
});

app.get('/pie-chart/:sectionsCount', function (req, res) {
    const responseBody = {};
    const sectionsCount = req.params.sectionsCount;
    const colors = generateHexColors(sectionsCount);

    const percentages = [15, 20, 25, 40];
    let remainingPercentage = 100;

    responseBody.sectionsCount = sectionsCount;
    responseBody.colors = colors;
    responseBody.percentages = percentages;

    res.write(JSON.stringify(responseBody));
    res.end();
});

app.get('/pie-chart', function (req, res) {
    const readStream = createFileReadStream('./pages/pie_chart.html')
        .on('error', function (err) {
            responseHandlers.INTERNAL_SERVER(req, res, err.message, true);
        });

    readStream.pipe(res);
});