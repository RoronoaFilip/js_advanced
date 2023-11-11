const http = require('http');
const {router, middleware} = require('./router_and_middleware');

function myExpress() {

    const server = http.createServer((req, res) => {
        const url = req.url;

        middleware.use(middleware.extractBody);
        middleware.use(middleware.extractPathVariables);

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

module.exports = {myExpress};