const Firebase = require("../services/firebase")
const validFiring = require("../validation/validFiring")

module.exports = (async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body))
    const { start, durationSeconds, cooldownSeconds, type, id } = body

    if (!validFiring(start, durationSeconds, cooldownSeconds, type) || !id) {
        res.status(400).send("Invalid firing")
        return
    }

    const snapshot = await Firebase.firings_store.doc(id).get()

    if (!snapshot.exists) {
        res.status(400).send("Firing does not exist")
        return
    }

    const firing = { start, durationSeconds, cooldownSeconds, type: type.toUpperCase() }
    await Firebase.firings_store.doc(id).update(firing)
    firing["id"] = snapshot.id

    res.status(200).send(firing)
})