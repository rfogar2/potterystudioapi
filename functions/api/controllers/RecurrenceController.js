const Firebase = require("../services/firebase")
const moment = require("moment")

exports.getRecurrence = (async (req, res) => {
    const { recurrenceId } = req.params

    const snapshot = await Firebase.openings_store.where("recurrenceId", "==", recurrenceId).get()
    if (snapshot.docs.length === 0) {
        return res.status(400).send("Recurrence does not exist")
    }

    const openings = snapshot.docs
        .map((doc) => {
            const opening = doc.data()
            opening.id = doc.id
            return opening
        })
        .sort((a, b) => moment(a.start) - moment(b.start))

    return res.status(200).send(openings)
})

exports.deleteRecurrence = (async (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).send("Forbidden")
    }

    const { recurrenceId } = req.params

    const snapshot = await Firebase.openings_store.where("recurrenceId", "==", recurrenceId).get()
    const batch = Firebase.db.batch()
    snapshot.docs.forEach((doc) => batch.delete(doc.ref))

    await batch.commit()

    return res.status(200).send()
})