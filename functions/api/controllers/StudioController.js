/*
 {
     "code": String,
     "adminCode": String,
     "id": String,
     "name": String
 }
*/

const Firebase = require("../services/firebase")
const userController = require("./UserController")

exports.createStudio = (async (req, res) => {
    var userSnapshot = await Firebase.users_store.doc(req.userId).get()
    var user = userSnapshot.data()
    
    if (userSnapshot.exists && user.studioId !== null) {
        return await this.getStudio(req, res);
    }

    return res.status(400).send()

    // const { userName, studioName } = req.body

    // if (!userName || !studioName) {
    //     return res.status(400).send().end()
    // }

    // req.body.name = userName
    // req.body.studioCode = ""
    // await userController.createStudio(req, res)
    
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