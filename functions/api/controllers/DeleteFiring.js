const Firebase = require("../services/firebase")
const assert = require("assert")
const moment = require("moment")

module.exports = (async (req, res) => {
    const id = req.params.id
    await Firebase.firings_database.child(id).remove()

    res.status(204).send()
})