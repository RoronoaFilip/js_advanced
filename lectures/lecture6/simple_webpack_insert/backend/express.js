const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const {Server} = require('socket.io');
const {generateHexColors} = require('./utils/generate_random_hex_colors');
const {createFileReadStream} = require('./utils/file_read_stream');
const {createTransformStream} = require('./utils/file_transform');
const {responseHandlers} = require('./utils/response_handlers');
const http = require("http");


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});
const port = 8080;
const socketPort = 8081;

app.listen(port, () => {
    console.log('Server is listening on 8080');
})
server.listen(socketPort, () => {
    console.log(`Server is running on http://localhost:${socketPort}`);
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.raw());

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

    const percentages = [ 15, 20, 25, 40 ];
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

// Store user information and socket IDs
const users = {};

app.get('/login-form', (req, res) => {
    res.sendFile(__dirname + '/pages/login-form.html');
});

app.post('/chat', (req, res) => {
    const replacementMap = {
        name: req.body.name
    }

    const readStream = createFileReadStream(__dirname + '/pages/chat_box.html');
    const transformStream = createTransformStream(replacementMap);

    readStream.pipe(transformStream).pipe(res);
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    // Handle private messages
    socket.on('send private message', (data) => {
        const {to, message} = data;
        const toSocket = users[to];
        if (toSocket) {
            toSocket.emit('receive private message', {from: socket.id, message, username: data.username});
        } else {
            // Handle user not found
            socket.emit('private message error', `User ${to} not found`);
        }
    });

    // Store user information on connection
    socket.on('store user', (username) => {
        users[username] = socket;
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        // Remove user information on disconnect
        for (const [ key, value ] of Object.entries(users)) {
            if (value === socket) {
                delete users[key];
            }
        }
        console.log('User disconnected');
    });
});