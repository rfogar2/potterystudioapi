const Firebase = require("../services/firebase")
const moment = require("moment")

exports.getReservationsForUser = (async (req, res) => {
    const snapshot = await Firebase.openings_store.get()
    const openings = snapshot.docs
        .map((doc) => {
            const opening = doc.data()
            opening.id = doc.id
            return opening
        })
        .filter((opening) => opening.reservedUserIds.includes(req.userId))
        .sort((a, b) => moment(a.start) - moment(b.start))

    return res.status(200).send(openings)
})

exports.removeReservation = (async (req, res) => {
    const { openingId } = req.params

    const openingSnapshot = await Firebase.openings_store.doc(openingId).get()
    const opening = openingSnapshot.data()

    if (!opening) {
        return res.status(400).send("Opening does not exist")
    }

    opening.reservedUserIds = opening.reservedUserIds.filter((userId) => userId !== req.userId)
    await Firebase.openings_store.doc(openingId).update(opening)

    opening.id = openingId
    return res.status(200).send(opening)
})

exports.reserveOpening = (async (req, res) => {
    const { openingId } = req.params

    const openingSnapshot = await Firebase.openings_store.doc(openingId).get()
    const opening = openingSnapshot.data()
    
    const userNotBooked = !opening.reservedUserIds.includes(req.userId)
    
    if (opening.reservedUserIds.length >= opening.size && userNotBooked) {
        return res.status(400).send("Opening is fully booked")
    }

    if (userNotBooked) {
        opening.reservedUserIds.push(req.userId)
        await Firebase.openings_store.doc(openingId).update(opening)
    }
    opening.id = openingId

    return res.status(200).send(opening)
})