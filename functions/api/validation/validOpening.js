const moment = require("moment")

module.exports = (start, lengthSeconds, size, usersBooked) => 
    moment(start, moment.ISO_8601, true).isValid() &&
    lengthSeconds > 0 && Number.isInteger(lengthSeconds) &&
    size > 0 && Number.isInteger(size) &&
    (!usersBooked || (usersBooked && usersBooked.every((userId) => typeof userId === "string")))