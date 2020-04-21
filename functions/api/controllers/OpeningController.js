const moment = require("moment")
const Firebase = require("../services/firebase")
const validOpening = require("../validation/validOpening")
const uuid = require("uuid")

/*
{
    start: Date,
    lengthSeconds: Int,
    size: Int,
    recurrence?: {
        type: only "WEEKLY" currently supported,
        numberOfRecurrences: Int
    }
}
*/

exports.createOpening = (async (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).send("Forbidden")
    }

    let body = JSON.parse(JSON.stringify(req.body))
    const { start, lengthSeconds, size, recurrence } = body

    if (!validOpening(start, lengthSeconds, size, null, recurrence)) {
        return res.status(400).send("Invalid opening")
    }

    const occurrences = recurrence ? recurrence.numberOfOccurrences : 1
    const recurrenceId = uuid.v4()
    const openings = []
    const batch = Firebase.db.batch()

    for (i = 0; i < occurrences; i++) {
        const durationUnit = recurrenceTypeToDurationUnit(recurrence ? recurrence.type : "")
        const openingStart = moment(start).add(i, durationUnit).toISOString()

        const ref = Firebase.openings_store.doc()
        const opening = {
            start: openingStart,
            lengthSeconds,
            size, 
            reservedUserIds: [],
            id: ref.id,
            recurrenceId: occurrences > 1 ? recurrenceId : null
        }

        batch.set(ref, opening)
        openings.push(opening)
    }

    await batch.commit()

    return res.status(201).send(openings)
})

recurrenceTypeToDurationUnit = (type) => {
    if (type === "DAILY") {
        return "days"
    } else if (type === "WEEKLY") {
        return "weeks"
    } else {
        return "months"
    }
}

exports.deleteOpening = (async (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).send("Forbidden")
    }

    const { openingId } = req.params
    await Firebase.openings_store.doc(openingId).delete()

    return res.status(204).send()
})

exports.updateOpening = (async (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).send("Forbidden")
    }

    let body = JSON.parse(JSON.stringify(req.body))
    const { start, lengthSeconds, size, id } = body

    if (!validOpening(start, lengthSeconds, size, null, null)) {
        return res.status(400).send("Invalid opening")
    }

    const snapshot = await Firebase.openings_store.doc(id).get()

    if (!snapshot.exists) {
        return res.status(400).send("Opening does not exist")
    }

    const opening = snapshot.data()
    opening.start = start
    opening.lengthSeconds = lengthSeconds
    opening.size = size
    await Firebase.openings_store.doc(id).update(opening)
    opening.id = id

    return res.status(200).send(opening)
})

exports.getAllOpenings = (async (_req, res) => {
    const snapshot = await Firebase.openings_store.get()
    const openings = snapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => moment(a.start) - moment(b.start))

    return res.status(200).send(openings)
})

exports.getOpening = (async (req, res) => {
    const { openingId } = req.params

    const doc = await Firebase.openings_store.doc(openingId).get()
    const opening = doc.data()

    if (req.isAdmin) {
        const usersSnapshot = await Firebase.users_store.get()
        const reservedUsers = usersSnapshot.docs
            .map((doc) => doc.data())
            .filter((reservedUser) => opening.reservedUserIds.includes(reservedUser.id))
            .sort((a, b) => a.name - b.name)

        opening["reservedUsers"] = reservedUsers
    } else {
        opening["reservedUsers"] = []
    }

    return res.status(200).send(opening)
})