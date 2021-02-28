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

// Get a reference to the database service
var database = firebase.database();

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.availableLocations = functions.https.onRequest((request, response) => {
    const params = request.url.split("/");
    response.setHeader('Content-Type', 'application/json')
    return firebase.database().ref('locations').once('value', (snapshot) => {
        snapshot.forEach(function(childSnapshot) {
        var location = childSnapshot.val();
        if (location.state === params[1] && location.city === params[2]){
            response.send({"success": true});
        }
        });
        response.send({"success": false});
     });
});

exports.tutorMatches = functions.https.onRequest((request, response) => {
    const params = request.url.split("/");
    userid = params[1]
    //response.setHeader('Content-Type', 'application/json')
    return firebase.database().ref('users/'+ userid).once('value', (snapshot) => {
        var user = snapshot.val();
        //user.maxSession, user.minSession
        //query users that have a pay range that is within the min and the max for the user
        // Create a reference to the cities collection
        const tutors = firebase.database().ref("users").where('user_type', '==', 'tutor');
        // Create a query against the collection
        const tutorMatch = tutors.where('minSession','>=',user.minSession).where('minSession','<=',user.maxSession).get();
        response.send(tutorMatch.val());
     });
});