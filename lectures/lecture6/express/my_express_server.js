const http = require('http');

function routeToRegEx(route) {
    if (!route.includes(':')) {
        return new RegExp(`^${route}$`);
    }

    const routeParts = route.split('/').map(part => {
        if (part.startsWith(':')) {
            return '([^\/]+)';
        }

        return part;
    });

    return new RegExp(`^${routeParts.join('/')}$`);
}

function myExpress() {
    const middleware = {
        middlewareStack: [],
        use(middleware) {
            this.middlewareStack.push(middleware);
        },
        extractBody(req, res, next) {
            let body = '';

            req.on('data', (chunk) => {
                body += chunk;
            });

            req.on('end', () => {
                req.body = body;
                next();
            });
        },
        extractPathVariables(req, res, next) {
            const url = req.url.split('?')[0]; // Remove query parameters
            const routeHandlerMap = router.routerHandlerMap;

            const routeHandler = Object.entries(routeHandlerMap)
                .find(([ route, handlers ]) => {
                    const regex = routeToRegEx(route);
                    return regex.test(url);
                });

            if (routeHandler) {
                const [ route, handlers ] = routeHandler;
                const regex = routeToRegEx(route);
                const matches = url.match(regex);
                matches.shift(); // Remove the full match
                const routeParams = route.split('/').filter(part => part.startsWith(':')).map(param => param.slice(1));
                req.params = Object.fromEntries(routeParams.map((param, index) => [ param, matches[index] ]));
            }

            next();
        },
    }
    const router = {
        routerHandlerMap: { // Saves URLs and their function Handlers by http method
            // "/test": { [method]: handler }
        },
        handleRouter(url, req, res) {
            const routeHandlerMap = Object.entries(router.routerHandlerMap)
                .find(([ route, handlers ]) => {
                    const regex = routeToRegEx(route);
                    return url.match(regex);
                }) || {};

            const [ path, methodHandlers ] = routeHandlerMap;
            const methodHandler = methodHandlers && methodHandlers[req.method];

            if (path.includes(':')) {
                middleware.use(middleware.extractPathVariables);
            }

            if (!methodHandler) {
                res.writeHead(404);
                res.end();
                return;
            }

            // Middleware execution
            let middlewareIndex = 0;
            const executeMiddleware = function () {
                if (middlewareIndex < middleware.middlewareStack.length) {
                    const currentMiddleware = middleware.middlewareStack[middlewareIndex];
                    currentMiddleware(req, res, () => {
                        middlewareIndex++;
                        executeMiddleware();
                    });
                } else {
                    // All middleware executed, now execute the route handler
                    methodHandler(req, res);
                    res.end();
                }
            };

            executeMiddleware();
        },
    };

    const server = http.createServer((req, res) => {
        const url = req.url;

        if (req.method === 'POST' || req.method === 'PUT') {
            middleware.use(middleware.extractBody);
        }

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