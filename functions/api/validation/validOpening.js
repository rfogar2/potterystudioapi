const moment = require("moment")

module.exports = (start, lengthSeconds, size, usersBooked, recurrence) => 
    moment(start, moment.ISO_8601, true).isValid() &&
    Number.isInteger(lengthSeconds) && lengthSeconds > 0 &&
    Number.isInteger(size) && size >= 0 &&
    (!usersBooked || usersBooked.every((userId) => typeof userId === "string")) &&
    (!recurrence || 
        (recurrence.type && ["DAILY", "WEEKLY", "MONTHLY"].some(t => recurrence.type.toUpperCase() === t) &&
        Number.isInteger(recurrence.numberOfOccurrences) && recurrence.numberOfOccurrences > 0))