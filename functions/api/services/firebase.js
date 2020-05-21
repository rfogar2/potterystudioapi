const admin = require("firebase-admin");
admin.initializeApp();

exports.admin = admin;
exports.firings_store = admin.firestore().collection("firing");
exports.openings_store = admin.firestore().collection("opening");
exports.users_store = admin.firestore().collection("user");
exports.studio_store = admin.firestore().collection("studio");
exports.db = admin.firestore()