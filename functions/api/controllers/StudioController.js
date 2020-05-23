const Firebase = require("../services/firebase")
const userController = require("./UserController")
const randomstring = require("randomstring")

exports.createStudio = (async (req, res) => {
    var userSnapshot = await Firebase.users_store.doc(req.userId).get()
    var user = userSnapshot.data()
    
    if (userSnapshot.exists && user.studioId !== null) {
        return await this.getStudio(req, res);
    }

    const { userName, studioName } = req.body

    if (!userName || !studioName) {
        return res.status(400).send().end()
    }

    const ref = Firebase.studio_store.doc()
    const studio = {
        id: ref.id,
        code: randomstring.generate(8), // todo: make sure no other studio has this code
        adminCode: randomstring.generate(8),
        name: studioName
    }

    await Firebase.studio_store.doc(studio.id).set(studio)
    const success = await userController.createUserHelper(req.userId, userName, studio.code, true, res, false)

    // todo: if exception or success === false, delete studio created

    return res.status(success ? 201 : 400).send().end()
})

exports.getStudio = (async (req, res) => {
    const { user } = req;

    const studioSnapshot = await Firebase.studio_store.doc(user.studioId).get()
    const studio = studioSnapshot.data()

    if (user.isAdmin !== true) {
        studio.code = null
        studio.adminCode = null
    }

    return res.status(200).send(studio).end()
})