const Firebase = require("../services/firebase")
const validFiring = require("../validation/validFiring")

module.exports = (async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body))
    const { start, durationSeconds, cooldownSeconds, type } = body

    if (!validFiring(start, durationSeconds, cooldownSeconds, type)) {
        res.status(400).send("Invalid firing")
        return
    }

    const id = Firebase.firings_store.doc().id
    const firing = {
        start,
        durationSeconds,
        cooldownSeconds,
        type: type.toUpperCase(),
        id
    }
    const ref = await Firebase.firings_store.doc(id).set(firing);

    res.status(201).send(firing)
})