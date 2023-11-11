const { myExpress } = require('./my_express_server');

const app = myExpress();
const port = 8080;
app.listen(port, function () {
    console.log('Server is listening on port 8080');
});

app.get('/test', function (req, res) {
    console.log('url is test');
    res.write('Hello World');
});

app.get('/user', function (req, res) {
    res.write('All Users');
});

app.get('/user/:id', function (req, res) {
    const id = req.params.id;
    res.write('Here is ID: ' + id);
});

app.post('/user', function (req, res) {

});

app.put('/user/:id', function (req, res) {

});

app.delete('/user/:id', function (req, res) {

});

app.get('/user/:id/post/:postId', function (req, res) {

});
