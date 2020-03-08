const firebase = require("./firebase");

module.exports = (req, res, next) => {
    const idToken = req.header("Authorization");
    firebase.admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            return next();
        })
        .catch(error => { 
            res.status(401).send(error); 
            return res.end();
        })
}