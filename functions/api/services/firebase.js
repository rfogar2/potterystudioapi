const admin = require("firebase-admin");
const functions = require('firebase-functions');
admin.initializeApp();

exports.admin = admin;
exports.firings_database = admin.database().ref("firings");