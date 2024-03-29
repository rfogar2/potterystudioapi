const userController = require("./controllers/UserController")
const firingController = require("./controllers/FiringController")
const openingController = require("./controllers/OpeningController")
const recurrenceController = require("./controllers/RecurrenceController")
const reservationController = require("./controllers/ReservationController")
const studioController = require("./controllers/StudioController")

module.exports = (app) => {

    app.route("/user/valid")
        .get(userController.validUser)

    app.route("/user")
        .post(userController.createUser)
        .get(userController.getUser)
        .delete(userController.deleteUser)
        .put(userController.updateUser)

    app.route("/user/present")
        .get(userController.presentUsers)
        .put(userController.setAsPresent)

    app.route("/user/absent")
        .put(userController.setAsAbsent)

    app.route("/user/admin")
        .put(userController.registerAsAdmin)

    app.route("/firing")
        .post(firingController.createFiring)
        .get(firingController.getAllFirings)
        .put(firingController.updateFiring)

    app.route("/firing/:firingId")
        .delete(firingController.deleteFiring)
        .get(firingController.getFiring)

    app.route("/opening")
        .post(openingController.createOpening)
        .put(openingController.updateOpening)
        .get(openingController.getAllOpenings)

    app.route("/opening/:openingId")
        .delete(openingController.deleteOpening)
        .get(openingController.getOpening)
        
    app.route("/opening/recurrence/:recurrenceId")
        .get(recurrenceController.getRecurrence)
        .delete(recurrenceController.deleteRecurrence)
        
    app.route("/opening/:openingId/reserve")
        .put(reservationController.reserveOpening)
        .delete(reservationController.removeReservation)

    app.route("/opening/reservation/user")
        .get(reservationController.getReservationsForUser)

    app.route("/studio")
        .post(studioController.createStudio)

    app.route("/studio/banner")
        .put(studioController.updateBanner)
}
