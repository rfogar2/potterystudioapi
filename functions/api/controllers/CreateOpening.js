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

module.exports = (async (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body))
    const { start, lengthSeconds, size, recurrence } = body

    if (!validOpening(start, lengthSeconds, size, null, recurrence)) {
        res.status(400).send("Invalid opening")
        return
    }

    const occurrences = recurrence ? recurrence.numberOfOccurrences : 1
    const recurrenceId = uuid.v4()
    const openings = []

    for (i = 0; i < occurrences; i++) {
        const durationUnit = recurrenceTypeToDurationUnit(recurrence ? recurrence.type : "")
        const openingStart = moment(start).add(i, durationUnit)

        const opening = { openingStart, lengthSeconds, size }
        if (occurrences > 1) {
            opening.recurrenceId = recurrenceId
        }

        // todo: use batching to avoid doing multiple writes
        const ref = await Firebase.openings_store.add(opening)
        opening["id"] = ref.id
        openings.push(opening)
    }

    res.status(201).send(openings)
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