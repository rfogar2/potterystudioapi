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
        var userSnapshot = await Firebase.users_store.doc(decodedToken.uid).get()
        
        req.userId = decodedToken.uid
        if (userSnapshot.exists) {
            var user = userSnapshot.data()
            req.user = user
            req.isAdmin = user.isAdmin
        }
        return next()
    } catch (e) {
        console.log(e);
        return forbid()
    }
}