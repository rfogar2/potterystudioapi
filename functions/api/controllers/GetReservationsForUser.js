const Firebase = require("../services/firebase")
const moment = require("moment")

module.exports = (async (req, res) => {
    const { userId } = req.params

    const snapshot = await Firebase.openings_store.get()
    const openings = snapshot.docs
        .map((doc) => {
            const opening = doc.data()
            opening.id = doc.id
            return opening
        })
        .filter((opening) => opening.reservedUsers.includes(userId))
        .sort((a, b) => moment(a.start) - moment(b.start))

    res.status(200).send(openings)
})