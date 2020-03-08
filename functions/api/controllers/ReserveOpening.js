const Firebase = require("../services/firebase")

module.exports = (async (req, res) => {
    const { openingId, userId } = req.params

    const openingSnapshot = await Firebase.openings_store.doc(openingId).get()
    const opening = openingSnapshot.data()
    
    if (!opening.bookedUsers) {
        opening.bookedUsers = []
    }

    const userNotBooked = !opening.bookedUsers.includes(userId)
    
    if (opening.bookedUsers.length >= opening.size && userNotBooked) {
        res.status(400).send("Opening is fully booked")
        return
    }

    if (userNotBooked) {
        opening.bookedUsers.push(userId)
        await Firebase.openings_store.doc(openingId).update(opening)
    }
    opening.id = openingId

    res.status(200).send(opening)
})