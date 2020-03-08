const moment = require("moment")

module.exports = (start, durationSeconds, cooldownSeconds, type) => 
    durationSeconds > 0 && Number.isInteger(durationSeconds) &&
    cooldownSeconds > 0 && Number.isInteger(durationSeconds) &&
    moment(start, moment.ISO_8601, true).isValid() &&
    type && (type.toUpperCase() === "BISQUE" || type.toUpperCase() === "GLAZE")