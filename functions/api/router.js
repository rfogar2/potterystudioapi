const createFiringController = require("./controllers/CreateFiring")
const deleteFiringController = require("./controllers/DeleteFiring")
const getAllFiringsController = require("./controllers/GetAllFirings")
const updateFiringController = require("./controllers/UpdateFiring")
// const auth = require('../../api/Services/auth');

module.exports = (app) => {
    // app.use(auth);

    app.route("/firing")
        .post(createFiringController)
        .get(getAllFiringsController)
        .put(updateFiringController)

    app.route("/firing/:id")
        .delete(deleteFiringController)

    // app.route('/debate')
    //     .post(controller.create_debate)

    // app.route('/debate/:id')
    //     .get(controller.get_debate)
    //     .delete(controller.delete_debate)
}
