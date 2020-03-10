const Firebase = require("../services/firebase")

exports.validUser = (async (req, res) => {
    const snapshot = await Firebase.users_store.where("userId", "==", req.user).get()
    const user = snapshot.data()

    return res
        .status(user && user.valid ? 200 : 403)
        .send()
        .end();
})

exports.createUser = (async (req, res) => {
    // todo: encrypt/decrypt this???
    const { companySecret } = req.params

    const snapshot = await Firebase.company_store.where("companySecret", "==", companySecret).get()

    if (snapshot.size == 1) {
        const user = { companyId: snapshot.docs[0].id, userId: req.user, valid: true }

        await Firebase.users_store.add(user);
        return res.status(201).send(user).end();
    } else {
        return res.status(403).send().end();
    }
})