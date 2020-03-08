const Firebase = require("../services/firebase")

module.exports = (async (req, res) => {
    const id = req.params.id
    await Firebase.firings_store.doc(id).delete()

    res.status(204).send()
})