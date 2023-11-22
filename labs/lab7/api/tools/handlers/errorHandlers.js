function handle400(req, res, end = false) {
    res.writeHead(400);

    if (end) {
        res.end();
    }
}

function handle404(req, res, end = false) {
    res.writeHead(404);

    if (end) {
        res.end();
    }
}

const errorHandlers = {
    handle400,
    handle404,
};

module.exports = errorHandlers;
