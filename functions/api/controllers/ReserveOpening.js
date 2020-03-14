const Firebase = require("../services/firebase")

module.exports = (async (req, res) => {
    const { openingId, userId } = req.params

    if (req.userId !== userId) {
        return res.status(403).send("Cannot reserve for another user")
    }

    const openingSnapshot = await Firebase.openings_store.doc(openingId).get()
    const opening = openingSnapshot.data()
    
    if (!opening.reservedUsers) {
        opening.reservedUsers = []
    }

    const userNotBooked = !opening.reservedUsers.includes(userId)
    
    if (opening.reservedUsers.length >= opening.size && userNotBooked) {
        return res.status(400).send("Opening is fully booked")
    }

    if (userNotBooked) {
        opening.reservedUsers.push(userId)
        await Firebase.openings_store.doc(openingId).update(opening)
    }
    opening.id = openingId

    return res.status(200).send(opening)
})