const Firebase = require("../services/firebase")
const moment = require("moment")

module.exports = (async (_req, res) => {
    const snapshot = await Firebase.firings_store.get()
    const firings = snapshot.docs
        .map((doc) => {
            const firing = doc.data()
            firing["id"] = doc.id
            return firing
        })
        .sort((a, b) => moment(b.start) - moment(a.start))

    res.status(200).send(firings)
})