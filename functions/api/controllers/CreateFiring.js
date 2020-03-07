const Firebase = require("../services/firebase")
const assert = require("assert")
const moment = require("moment")

module.exports = (async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body))

    const { start, durationSeconds, cooldownSeconds } = body
    
    assert(durationSeconds > 0 && Number.isInteger(durationSeconds))
    assert(cooldownSeconds > 0 && Number.isInteger(durationSeconds))
    assert(moment(start, moment.ISO_8601, true).isValid())

    const firing = { start, durationSeconds, cooldownSeconds }
    const ref = await Firebase.firings_database.push(firing)
    firing["id"] = ref.key

    res.status(201).send(firing)
})