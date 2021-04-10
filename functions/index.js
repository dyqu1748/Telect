const functions = require("firebase-functions");
const admin = require("firebase-admin");
const matches = require('./matches');
const locations = require('./locations');
const cors = require('cors');

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

exports.updateAvailability =  functions.https.onRequest(async (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    avail = JSON.parse(request.body)

    const usersRef = firestore.collection('users');
    let doc = await usersRef.doc(avail.docid).get();
    if (!doc.exists) {
        response.send({"success": false});
    } else {
        //update the availability
        await firestore.collection("users").doc(avail.docid).set({
            availability: avail.availability,
        }, {merge:true})
        .then(() => {
            cors()(request, response, () => {
                response.send({"success": true});
            });
         })
        .catch((error) => {
            cors()(request, response, () => {
                response.send("Error getting documents: " + error);
            });
        });
    }
});









