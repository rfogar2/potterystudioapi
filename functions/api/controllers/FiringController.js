const Firebase = require("../services/firebase")
const validFiring = require("../validation/validFiring")
const moment = require("moment");

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
        studioId: req.user.studioId,
        id
    }
    await Firebase.firings_store.doc(id).set(firing);

    return res.status(201).send(firing)
})

exports.getAllFirings = (async (req, res) => {
    const { includePast } = req.query;

    const snapshot = await Firebase.firings_store.where("studioId", "==", req.user.studioId).get()
    const firings = snapshot.docs
        .map((doc) => doc.data())
        .filter((firing) => {
            return includePast === "true" || 
                moment(firing.start)
                    .add(firing.durationSeconds + firing.cooldownSeconds, "seconds")
                    .isAfter(moment())
        })
        .sort((a, b) => moment(a.start) - moment(b.start))

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

    const firing = snapshot.data()

    if (firing.studioId !== req.user.studioId) {
        return res.status(403).send()
    }

    firing.start = start
    firing.durationSeconds = durationSeconds
    firing.cooldownSeconds = cooldownSeconds,
    firing.type = type.toUpperCase()

    await Firebase.firings_store.doc(id).update(firing)

    return res.status(200).send(firing)
})

exports.deleteFiring = (async (req, res) => {
    const { firingId } = req.params
    
    if (!req.isAdmin) {
        return res.status(403).send("Forbidden")
    }

    const snapshot = await Firebase.firings_store.doc(firingId).get()
    if (snapshot.data().studioId !== req.user.studioId) {
        return res.status(403).send()
    }

    await Firebase.firings_store.doc(firingId).delete()

    return res.status(204).send()
})

exports.getFiring = (async (req, res) => {
    const { firingId } = req.params

    const doc = await Firebase.firings_store.doc(firingId).get()
    const firing = doc.data()

    if (firing.studioId !== req.user.studioId) {
        return res.status(403).send()
    }

    return res.status(200).send(firing)
})