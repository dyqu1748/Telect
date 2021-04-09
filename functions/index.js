const functions = require("firebase-functions");
const admin = require("firebase-admin");
const matches = require('./matches');
const locations = require('./locations');

// Set the configuration for your app
var firebaseConfig = {
apiKey: "AIzaSyC_RpCqU1yIDiyhEBadqOL-ph09x-7wzJg",
authDomain: "telect-6026a.firebaseapp.com",
databaseURL: "https://telect-6026a-default-rtdb.firebaseio.com",
projectId: "telect-6026a",
storageBucket: "telect-6026a.appspot.com",
messagingSenderId: "193710214424",
appId: "1:193710214424:web:d0269dce35f3a81b53226d",
measurementId: "G-GBP3LB0T8V"
};

admin.initializeApp(firebaseConfig)
const firestore = admin.firestore()


exports.availableLocations = functions.https.onRequest((request, response) => {
    locations.handler(request,response,firestore);
});

exports.tutorMatches =  functions.https.onRequest( async(request, response) => {
    await matches.handler(request,response,firestore);
});










