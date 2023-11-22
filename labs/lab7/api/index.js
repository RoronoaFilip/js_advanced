const router = require('express').Router();
const eventRouter = require('./event/event_router');

router.use('/event', eventRouter);

module.exports = router;
