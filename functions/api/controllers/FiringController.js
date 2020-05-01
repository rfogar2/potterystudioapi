const Firebase = require("../services/firebase")
const validFiring = require("../validation/validFiring")

exports.createFiring = (async (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).send("Forbidden")
    }

    let body = JSON.parse(JSON.stringify(req.body))
    const { start, durationSeconds, cooldownSeconds, type } = body

    if (!validFiring(start, durationSeconds, cooldownSeconds, type)) {
        return res.status(400).send("Invalid firing")
    }

    const id = Firebase.firings_store.doc().id
    const firing = {
        start,
        durationSeconds,
        cooldownSeconds,
        type: type.toUpperCase(),
        id
    }
    await Firebase.firings_store.doc(id).set(firing);

    return res.status(201).send(firing)
})

exports.getAllFirings = (async (_req, res) => {
    const snapshot = await Firebase.firings_store.get()
    const firings = snapshot.docs
        .map((doc) => {
            const firing = doc.data()
            firing["id"] = doc.id
            return firing
        })
        .sort((a, b) => moment(b.start) - moment(a.start))

    return res.status(200).send(firings)
})

exports.updateFiring = (async (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).send("Forbidden")
    }

    let body = JSON.parse(JSON.stringify(req.body))
    const { start, durationSeconds, cooldownSeconds, type, id } = body

    if (!validFiring(start, durationSeconds, cooldownSeconds, type) || !id) {
        return res.status(400).send("Invalid firing")
    }

    const snapshot = await Firebase.firings_store.doc(id).get()

    if (!snapshot.exists) {
        return res.status(400).send("Firing does not exist")
    }

    const firing = { start, durationSeconds, cooldownSeconds, type: type.toUpperCase() }
    await Firebase.firings_store.doc(id).update(firing)
    firing["id"] = snapshot.id

    return res.status(200).send(firing)
})

exports.deleteFiring = (async (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).send("Forbidden")
    }

    const { firingId } = req.params
    await Firebase.firings_store.doc(firingId).delete()

    return res.status(204).send()
})

exports.getFiring = (async (req, res) => {
    const { firingId } = req.params

    const doc = await Firebase.firings_store.doc(firingId).get()
    const firing = doc.data()

    return res.status(200).send(firing)
})