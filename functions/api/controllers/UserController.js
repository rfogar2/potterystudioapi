const Firebase = require("../services/firebase")
const functions = require("firebase-functions")
const NodeRSA = require('node-rsa')

exports.validUser = (async (req, res) => {
    return res.status(req.user ? 200 : 403).send()
})

exports.createUser = (async (req, res) => {
    const { name, studioCode } = req.body

    if (!studioCode || !name) {
        return res.status(400).send().end()
    }

    const snapshot = await Firebase.studio_store.where("code", "==", studioCode).get()
    if (snapshot.size === 1) {
        var studio = snapshot.docs[0].data()

        const user = {
            name: name,
            studioId: studio.id,
            id: req.userId
        }
        
        await Firebase.users_store.doc(req.userId).set(user)
        
        user.studioName = studio.name;
        return res.status(201).send(user).end()
    } else {
        return res.status(403).send().end()
    }
})

exports.getUser = (async (req, res) => {
    const { user } = req;

    const studioSnapshot = await Firebase.studio_store.doc(user.studioId).get()
    const studio = studioSnapshot.data()

    user.studioName = studio.name;

    return res.status(200).send(user).end()
})

exports.deleteUser = (async (req, res) => {
    const { user } = req;

    // todo: remove user from all opening reservations

    await Firebase.users_store.doc(user.id).delete()

    return res.status(204).send()
})

decryptSecret = (encrypted) => {
    const privateKey = functions.config().keys.privatekey

    const key = new NodeRSA(Buffer.from(privateKey))
    key.setOptions({encryptionScheme: "pkcs1"})
    return key.decrypt(encrypted, "utf8");
}

exports.registerAsAdmin = (async (req, res) => {
    const { user } = req;
    const { adminCode } = req.body

    if (user.isAdmin === true) {
        return res.status(200).send()
    }

    if (adminCode === null) {
        return res.status(400).send().end()
    }

    const studioSnapshot = await Firebase.studio.doc(user.studioId).get()
    const studio = studioSnapshot.data()

    if (studio.adminCode === adminCode) {
        user.isAdmin = true;
        await Firebase.users_store.doc(user.id).set(user)

        return res.status(200).send()
    } else {
        return res.status(401).send()
    }
})