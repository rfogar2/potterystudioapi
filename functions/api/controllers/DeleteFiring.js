const Firebase = require("../services/firebase")

module.exports = (async (req, res) => {
    const { firingId } = req.params
    await Firebase.firings_store.doc(firingId).delete()

    res.status(204).send()
})