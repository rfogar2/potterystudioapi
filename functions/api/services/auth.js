const Firebase = require("./firebase");

module.exports = async (req, res, next) => {
    function forbid() {
        return res.status(401).send("Unauthorized")
    }

    const idToken = req.header("Authorization")
    if (!idToken) {
        return forbid()
    }

    try {
        var decodedToken = await Firebase.admin.auth().verifyIdToken(idToken)

        req.userId = decodedToken
        return next()
    } catch (e) {
        console.log(e);
        return forbid()
    }
}