const Firebase = require("../services/firebase")
const functions = require("firebase-functions")
const NodeRSA = require('node-rsa')

exports.validUser = (async (req, res) => {
    return res.status(req.user ? 200 : 403).send()
})

exports.createUser = (async (req, res) => {
    const { name, companyName, companySecret } = req.body

    if (!companyName || !companySecret || !name) {
        return res.status(400).send().end()
    }

    const privateKey = functions.config().keys.privatekey

    const key = new NodeRSA(Buffer.from(privateKey))
    key.setOptions({encryptionScheme: "pkcs1"})
    const decryptedCompanySecret = key.decrypt(companySecret, "utf8")

    const snapshot = await Firebase.company_store.where("companyName", "==", companyName).get()
    if (snapshot.size === 1) {
        var company = snapshot.docs[0].data()
        if (company.companySecret !== decryptedCompanySecret) {
            return res.status(400).send().end()
        }

        const user = {
            name: name,
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

exports.deleteUser = (async (req, res) => {
    const { user } = req;

    await Firebase.users_store.doc(user.id).delete()

    return res.status(204).send()
})