const router = require('express').Router();
const { idGenerator } = require('../tools/id/id_generator');
const errorHandlers = require('../tools/handlers/errorHandlers');

function Event(id, name, capacity) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
    this.bookings = [];
}

function Booking(id, firstName, lastName) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
}

let events = [];

router.post('/', (req, res) => {
    if (!req.body.name || !req.body.capacity) {
        errorHandlers.handle400(req, res);
        res.write('One or more mandatory Fields Missing: Name, Capacity');
        res.end();
        return;
    }

    const { name, capacity } = req.body;

    const id = idGenerator.generateEventId();
    const event = new Event(id, name, capacity);

    events[id] = event;

    res.send(event);
});

router.get('/', (req, res) => {
    res.send(events);
});

router.get('/:id', (req, res) => {
    const event = events.find((currEvent) => +currEvent.id === +req.params.id);

    if (!event) {
        errorHandlers.handle404(req, res, true);
        return;
    }

    res.send(event);
});

router.delete('/:id', (req, res) => {
    const event = events[req.params.id];

    if (!event) {
        errorHandlers.handle404(req, res, true);
        return;
    }

    events = events.filter((currEvent) => +currEvent.id !== +event.id);
    res.send(event);
});

router.post('/:id/booking', (req, res) => {
    const event = events[req.params.id];

    if (!event) {
        errorHandlers.handle404(req, res, true);
        return;
    }

    if (event.bookings.length >= event.capacity) {
        errorHandlers.handle400(req, res);
        res.write(`Capacity Exceeded! Max Capacity is ${event.capacity}`);
        res.end();
        return;
    }

    const { firstName, lastName } = req.body;

    const id = idGenerator.generateBookingId();
    const booking = new Booking(id, firstName, lastName);

    event.bookings[id] = booking;

    res.send(booking);
});

router.get('/:id/booking', (req, res) => {
    const event = events.find((currEvent) => +currEvent.id === +req.params.id);

    if (!event) {
        errorHandlers.handle404(req, res, true);
        return;
    }

    res.send(event.bookings);
});

router.get('/:id/booking/:bookingId', (req, res) => {
    const event = events.find((currEvent) => +currEvent.id === +req.params.id);

    if (!event) {
        errorHandlers.handle404(req, res, true);
        return;
    }

    const booking = event.bookings.find((currBooking) => +currBooking.id === +req.params.bookingId);

    if (!booking) {
        errorHandlers.handle404(req, res, true);
        return;
    }

    res.send(booking);
});

router.delete('/:id/booking/:bookingId', (req, res) => {
    let event = events[req.params.id];

    if (!event || !event.bookings[req.params.bookingId]) {
        errorHandlers.handle404(req, res, true);
        return;
    }

    const booking = event.bookings[req.params.bookingId];
    event.bookings = event.bookings.filter((currBooking) => +currBooking.id !== +booking.id);
    res.send(booking);
});

module.exports = router;
