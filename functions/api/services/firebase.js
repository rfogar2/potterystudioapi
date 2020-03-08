const admin = require("firebase-admin");
admin.initializeApp();

exports.admin = admin;
exports.firings_store = admin.firestore().collection("firings");
exports.openings_store = admin.firestore().collection("openings");