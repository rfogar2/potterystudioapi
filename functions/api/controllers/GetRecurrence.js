const Firebase = require("../services/firebase")
const moment = require("moment")

module.exports = (async (req, res) => {
    const { recurrenceId } = req.params

    const snapshot = await Firebase.openings_store.where("recurrenceId", "==", recurrenceId).get()
    if (snapshot.docs.length === 0) {
        res.status(400).send("Recurrence does not exist")
        return
    }

    const openings = snapshot.docs
        .map((doc) => {
            const opening = doc.data()
            opening.id = doc.id
            return opening
        })
        .sort((a, b) => moment(a.start) - moment(b.start))

    res.status(200).send(openings)
})