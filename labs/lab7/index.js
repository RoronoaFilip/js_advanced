const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.json');
const apiRouter = require('./api');

const app = express();

app.use(bodyParser.json());
app.use('/api', apiRouter);

app.listen(config.serverPort, function () {
    console.log(`Server is listening on :${config.serverPort}`);
});

app.get('/', (req, res) => {
    res.send('Server is running');
});
