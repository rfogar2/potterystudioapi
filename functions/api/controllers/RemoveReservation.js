const Firebase = require("../services/firebase")

module.exports = (async (req, res) => {
    const { openingId, userId } = req.params

    const openingSnapshot = await Firebase.openings_store.doc(openingId).get()
    const opening = openingSnapshot.data()

    if (!opening) {
        res.status(400).send("Opening does not exist")
        return
    }

    opening.reservedUsers = opening.reservedUsers.filter((u) => u !== userId)
    await Firebase.openings_store.doc(openingId).update(opening)

    opening.id = openingId
    res.status(200).send(opening)
})