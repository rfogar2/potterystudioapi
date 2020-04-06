const userController = require("./controllers/UserController")
const firingController = require("./controllers/FiringController")
const openingController = require("./controllers/OpeningController")
const recurrenceController = require("./controllers/RecurrenceController")
const reservationController = require("./controllers/ReservationController")

module.exports = (app) => {

    app.route("/user/valid")
        .get(userController.validUser)

    app.route("/user")
        .post(userController.createUser)
        .get(userController.getUser)

    app.route("/firing")
        .post(firingController.createFiring)
        .get(firingController.getAllFirings)
        .put(firingController.updateFiring)

    app.route("/firing/:firingId")
        .delete(firingController.deleteFiring)

    app.route("/opening")
        .post(openingController.createOpening)
        .put(openingController.updateOpening)
        .get(openingController.getAllOpenings)

    app.route("/opening/:openingId")
        .delete(openingController.deleteOpening)
        
    app.route("/opening/recurrence/:recurrenceId")
        .get(recurrenceController.getRecurrence)
        .delete(recurrenceController.deleteRecurrence)
        
    app.route("/opening/:openingId/reserve")
        .put(reservationController.reserveOpening)
        .delete(reservationController.removeReservation)

    app.route("/opening/reservation/user")
        .get(reservationController.getReservationsForUser)
}
