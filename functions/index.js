const functions = require('firebase-functions')
const app = require('express')()
const cors = require('cors')()
const bodyParser = require('body-parser')
const router = require('./api/router')

app.use(cors)
app.use(bodyParser.json())
router(app)

exports.api = functions.https.onRequest(app)

