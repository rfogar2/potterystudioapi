const Firebase = require("../services/firebase")

module.exports = (async (req, res) => {
    const { openingId } = req.params
    await Firebase.openings_store.doc(openingId).delete()

    res.status(204).send()
})