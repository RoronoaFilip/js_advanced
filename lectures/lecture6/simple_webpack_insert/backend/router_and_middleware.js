const {responseHandlers} = require("./utils/response_handlers");

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
        if (!req.url.includes(':')) {
            req.params = {};
            next();
        }
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
    executeMiddleware(req, res, methodHandler, middlewareIndex = 0) {
        if (middlewareIndex < middleware.middlewareStack.length) {
            const currentMiddleware = middleware.middlewareStack[middlewareIndex];
            currentMiddleware(req, res, () => {
                middlewareIndex++;
                middleware.executeMiddleware(req, res, methodHandler, middlewareIndex);
            });
        } else {
            // All middleware executed, now execute the route handler
            methodHandler(req, res);
        }
    }
}

const router = {
    routerHandlerMap: { // Saves URLs and their function Handlers by http method
        // "/test": { [method]: handler }
    },
    handleRouter(url, req, res) {
        const routeHandlerMap = Object.entries(router.routerHandlerMap)
            .find(([ route, handlers ]) => {
                const regex = routeToRegEx(route);
                return regex.test(url);
            }) || [];

        const [ path, methodHandlers ] = routeHandlerMap;
        const methodHandler = methodHandlers && methodHandlers[req.method];

        if (!methodHandler) {
            responseHandlers.NOT_FOUND(req, res, '', true);
            return;
        }

        if (path.includes(':')) {
            middleware.use(middleware.extractPathVariables);
        }

        middleware.executeMiddleware(req, res, methodHandler);
    },
};

module.exports = {router, middleware};