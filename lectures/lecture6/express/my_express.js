const http = require('http');

function myExpress() {
    const router = {
        routerHandlerMap: { // Saves URLs and their function Handlers by http method
            // "/test": { [method]: handler }
        },
        handleRouter(url, req, res) {
            const routeHandlerMap = router.routerHandlerMap[url] || {};
            const methodHandler = routeHandlerMap[req.method];

            if (!methodHandler) {
                res.writeHead(404);
                res.end();
                return;
            }

            methodHandler(req, res);
            res.end();
            return;
        }
    };

    const server = http.createServer((req, res) => {
        const url = req.url;
        router.handleRouter(url, req, res);
    });

    return {
        get(route, handler) {
            const getRouteHandlers = router.routerHandlerMap[route] || {};
            getRouteHandlers.GET = handler;
            router.routerHandlerMap[route] = getRouteHandlers;
        },
        put(route, handler) {
            const putRouteHandlers = router.routerHandlerMap[route] || {};
            putRouteHandlers.PUT = handler;
            router.routerHandlerMap[route] = putRouteHandlers;
        },
        post(route, handler) {
            const postRouteHandlers = router.routerHandlerMap[route] || {};
            postRouteHandlers.POST = handler;
            router.routerHandlerMap[route] = postRouteHandlers;
        },
        delete(route, handler) {
            const deleteRouteHandlers = router.routerHandlerMap[route] || {};
            deleteRouteHandlers.DELETE = handler;
            router.routerHandlerMap[route] = deleteRouteHandlers;
        },
        listen: (port, callback) => {
            server.listen(port, callback);
        }
    };
}

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