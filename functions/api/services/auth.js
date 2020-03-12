const Firebase = require("./firebase");

module.exports = async (req, res, next) => {
    function forbid() {
        res.status(401).send("Nahhh looks sketchy"); 
        return res.end();
    }

    const idToken = req.header("Authorization");
    if (!idToken) {
        return forbid();
    }

    try {
        var decodedToken = await Firebase.admin.auth().verifyIdToken(idToken);
        var user = await Firebase.users_store.doc(decodedToken).get();

        if (!user.isValid) {
            return forbid();
        }

        req.user = decodedToken;
        return next();
    } catch (e) {
        return forbid();
    }
}