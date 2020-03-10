const firebase = require("./firebase");

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
        var decodedToken = await firebase.admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        return next();
    } catch (e) {
        return forbid();
    }
}