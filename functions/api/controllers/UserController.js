const Firebase = require("../services/firebase")
const functions = require("firebase-functions")
const NodeRSA = require('node-rsa')

exports.validUser = (async (req, res) => {
    return res.status(req.user ? 200 : 403).send()
})

exports.createUserHelper = async (userId, name, studioCode, isAdmin, res, shouldSend, imageUrl) => {
    const snapshot = await Firebase.studio_store.where("code", "==", studioCode).get()
    if (snapshot.size === 1) {
        var studio = snapshot.docs[0].data()

        const user = {
            name: name,
            studioId: studio.id,
            id: userId,
            isAdmin: isAdmin,
            profileImageUrl: imageUrl
        }
        
        await Firebase.users_store.doc(userId).set(user)
        
        user.studioName = studio.name;
        return shouldSend ? res.status(201).send(user).end() : true
    } else {
        return shouldSend ? res.status(403).send().end() : false
    }
}

exports.createUser = async (req, res) => {
    const { name, studioCode, profileImageUrl } = req.body

    if (!studioCode || !name) {
        return res.status(400).send().end()
    }

    return this.createUserHelper(req.userId, name, studioCode, false, res, true, profileImageUrl);
}

exports.getUser = (async (req, res) => {
    const { user } = req;

    const studioSnapshot = await Firebase.studio_store.doc(user.studioId).get()
    const studio = studioSnapshot.data()

    user.studioName = studio.name;

    if (user.isAdmin === true) {
        user.studioCode = studio.code;
        user.studioAdminCode = studio.adminCode;
    }

    return res.status(200).send(user).end()
})

exports.presentUsers = (async (req, res) => {
    const { user } = req;

    const snapshot = await Firebase.users_store.where("studioId", "==", user.studioId).get()
    const presentUsers = snapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.isPresent === true)
        .sort((a, b) => a.name.localeCompare(b.name))

    return res.status(200).send(presentUsers).end()
})

exports.setAsPresent = async (req, res) => {
    const { user } = req;

    user.isPresent = true;
    await Firebase.users_store.doc(user.id).set(user);

    return res.status(200).send(user).end();
}

exports.setAsAbsent = async (req, res) => {
    const { user } = req;

    user.isPresent = false;
    await Firebase.users_store.doc(user.id).set(user);

    return res.status(200).send(user).end();
}

exports.deleteUser = (async (req, res) => {
    const { user } = req;

    const snapshot = await Firebase.openings_store.where("studioId", "==", user.studioId).get()
    const openings = snapshot.docs.map((doc) => doc.data())

    const batch = Firebase.db.batch()

    for (var i = 0; i < openings.length; i++) {
        var opening = openings[i]
        opening.reservedUserIds = opening.reservedUserIds.filter((id) => id !== user.id)

        batch.set(Firebase.openings_store.doc(opening.id), opening)
    }

    await batch.commit()
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

    const studioSnapshot = await Firebase.studio_store.doc(user.studioId).get()
    const studio = studioSnapshot.data()

    if (studio.adminCode === adminCode) {
        user.isAdmin = true;
        await Firebase.users_store.doc(user.id).set(user)

        return res.status(200).send()
    } else {
        return res.status(400).send()
    }
})

exports.updateUser = async (req, res) => {
    const { user } = req;
    const { name, profileImageUrl } = req.body

    user.name = name || user.name

    if (profileImageUrl === "") {
        user.profileImageUrl = null
    } else {
        user.profileImageUrl = profileImageUrl || user.profileImageUrl
    }

    await Firebase.users_store.doc(user.id).set(user)
    return res.status(200).send(user).end()
}