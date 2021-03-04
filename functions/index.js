const functions = require("firebase-functions");
const firebase = require("firebase-admin");

// Set the configuration for your app
  // TODO: Replace with your project's config object
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

 firebase.initializeApp(firebaseConfig)
 const db = firebase.firestore();
// Get a reference to the database service
var database = firebase.database();

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.availableLocations = functions.https.onRequest((request, response) => {
    const params = request.url.split("/");
    response.setHeader('Content-Type', 'application/json')
    return db.collection('locations').where('state','==',params[1]).where('city','==',params[2]).get().then((snapshot) => {
        if (!snapshot.empty) {
            // doc.data() is never undefined for query doc snapshots
            response.send({"success": true})
        } else {
        response.send({"success": true});
        }
    });

});

exports.tutorMatches = functions.https.onRequest((request, response) => {
    const params = request.url.split("/");
    userid = params[1]
    //response.setHeader('Content-Type', 'application/json')
    return db.collection('users').doc(userid).get()((snapshot) => {
        var user = snapshot.val();
            response.send ({"success": user.user_type})
        });
        //user.maxSession, user.minSession
        //query users that have a pay range that is within the min and the max for the user
        // Create a reference to the cities collection
        //const tutors = firebase.database().ref("users")//.where('user_type', '==', 'tutor');
        // Create a query against the collection
        //const tutorMatch = tutors.where('minSession','>=',user.minSession).where('minSession','<=',user.maxSession).get();
        response.send("error");
});
