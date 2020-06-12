const env = process.env.NODE_ENV || 'development';

const firebaseAdmin = require("firebase-admin");
const firebaseServiceAccount = require('../config/firebaseKey.json')[env];

module.exports = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
    storageBucket: `${firebaseServiceAccount.project_id}.appspot.com`
});
