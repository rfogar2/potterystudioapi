const Firebase = require("../services/firebase")
const moment = require("moment")

module.exports = (async (req, res) => {
    const { recurrenceId } = req.params

    const snapshot = await Firebase.openings_store.where("recurrenceId", "==", recurrenceId).get()
    const batch = Firebase.db.batch()
    snapshot.docs.forEach((doc) => batch.delete(doc.ref))

    await batch.commit()

    res.status(200).send()
})