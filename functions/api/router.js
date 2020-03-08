const createFiringController = require("./controllers/CreateFiring")
const deleteFiringController = require("./controllers/DeleteFiring")
const getAllFiringsController = require("./controllers/GetAllFirings")
const updateFiringController = require("./controllers/UpdateFiring")
const createOpeningController = require("./controllers/CreateOpening")
const reserveOpeningController = require("./controllers/ReserveOpening")
const removeReservationController = require("./controllers/RemoveReservation")
const getRecurrenceController = require("./controllers/GetRecurrence")
const deleteRecurrenceController = require("./controllers/DeleteRecurrence")
const getReservationsForUserController = require("./controllers/GetReservationsForUser")
const updateOpeningController = require("./controllers/UpdateOpening")
const deleteOpeningController = require("./controllers/DeleteOpening")
const getAllOpeningsController = require("./controllers/GetAllOpenings")
// const auth = require('../../api/Services/auth');

module.exports = (app) => {
    // app.use(auth);

    app.route("/firing")
        .post(createFiringController)
        .get(getAllFiringsController)
        .put(updateFiringController)

    app.route("/firing/:firingId")
        .delete(deleteFiringController)

    app.route("/opening")
        .post(createOpeningController)
        .put(updateOpeningController)
        .get(getAllOpeningsController)

    app.route("/opening/:openingId")
        .delete(deleteOpeningController)

    app.route("/opening/:openingId/reserve/:userId")
        .put(reserveOpeningController)
        .delete(removeReservationController)

    app.route("/opening/recurrence/:recurrenceId")
        .get(getRecurrenceController)
        .delete(deleteRecurrenceController)

    app.route("/opening/reservation/user/:userId")
        .get(getReservationsForUserController)
}
