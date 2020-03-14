const Firebase = require("../services/firebase")

exports.validUser = (async (req, res) => {
    const user = req.user; // set by auth.js

    return res.status(user ? 200 : 403).send()
})

exports.createUser = (async (req, res) => {
    // todo: encrypt/decrypt this???
    const { companySecret } = req.params

    const snapshot = await Firebase.company_store.where("companySecret", "==", companySecret).get()

    if (snapshot.size === 1) {
        const user = {
            companyId: snapshot.docs[0].id,
            id: req.userId
        }

        await Firebase.users_store.doc(req.user).set(user);
        return res.status(201).send(user).end();
    } else {
        return res.status(403).send().end();
    }
})