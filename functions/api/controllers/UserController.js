const Firebase = require("../services/firebase")

exports.validUser = (async (req, res) => {
    return res.status(req.user ? 200 : 403).send()
})

exports.createUser = (async (req, res) => {
    // todo: encrypt/decrypt companySecret
    const { companyName, companySecret } = req.query

    if (!companyName || !companySecret) {
        return res.status(400).send().end()
    }

    const snapshot = await Firebase.company_store.where("companyName", "==", companyName).get()
    if (snapshot.size === 1) {
        var company = snapshot.docs[0].data()
        if (company.companySecret !== companySecret) {
            return res.status(400).send().end()
        }

        const user = {
            companyId: company.id,
            id: req.userId
        }
        
        await Firebase.users_store.doc(req.userId).set(user)
        
        user.companyName = companyName;
        return res.status(201).send(user).end()
    } else {
        return res.status(403).send().end()
    }
})

exports.getUser = (async (req, res) => {
    const { user } = req;

    const companySnapshot = await Firebase.company_store.doc(user.companyId).get()
    const company = companySnapshot.data()

    user.companyName = company.companyName;

    return res.status(200).send(user).end()
})