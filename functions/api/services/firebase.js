const admin = require("firebase-admin");
const functions = require('firebase-functions');
admin.initializeApp();

exports.admin = admin;
exports.firings_store = admin.firestore().collection("firings");