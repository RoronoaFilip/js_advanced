function generateEventId() {
    let currId = 0;
    return function () {
        return currId++;
    }
}

function generateBookingId() {
    let currId = 0;
    return function () {
        return currId++;
    }
}

const idGenerator = {
    generateBookingId: generateEventId(),
    generateEventId: generateEventId(),
}

module.exports = { idGenerator }
