const Firebase = require("../services/firebase")
const validOpening = require("../validation/validOpening")

module.exports = (async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body))
    const { start, lengthSeconds, size, id } = body

    if (!validOpening(start, lengthSeconds, size, null, null)) {
        res.status(400).send("Invalid opening")
        return
    }

    const snapshot = await Firebase.openings_store.doc(id).get()

    if (!snapshot.exists) {
        res.status(400).send("Opening does not exist")
        return
    }

    const opening = snapshot.data()
    opening.start = start
    opening.lengthSeconds = lengthSeconds
    opening.size = size
    await Firebase.openings_store.doc(id).update(opening)
    opening.id = id

    res.status(200).send(opening)
})