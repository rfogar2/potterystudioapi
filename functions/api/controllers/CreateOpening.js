const Firebase = require("../services/firebase")
const validOpening = require("../validation/validOpening")

/*
{
    start: Date,
    lengthSeconds: Int,
    size: Int
}
*/

module.exports = (async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body))
    const { start, lengthSeconds, size } = body

    if (!validOpening(start, lengthSeconds, size )) {
        res.status(400).send("Invalid opening")
        return
    }

    const opening = { start, lengthSeconds, size }
    const ref = await Firebase.openings_store.add(opening)
    opening["id"] = ref.id

    res.status(201).send(opening)
})