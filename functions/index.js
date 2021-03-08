const functions = require("firebase-functions");
const admin = require("firebase-admin");

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

 admin.initializeApp(firebaseConfig)
 const firestore = admin.firestore()

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Example code for use 
// db.collection("locations").get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       var location = doc.data();
//         console.log(`${location.city}, ${location.state}`);
//     });

exports.availableLocations = functions.https.onRequest((request, response) => {
    const params = request.url.split("/");
    response.setHeader('Content-Type', 'application/json')
    return firestore.collection('locations').where('state','==',params[1]).where('city','==',params[2]).get().then((snapshot) => {
        if (!snapshot.empty) {
            // doc.data() is never undefined for query doc snapshots
            response.send({"success": true})
        } else {
        response.send({"success": false});
        }
    });

});

exports.tutorMatches =  functions.https.onRequest(async (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    const params = request.url.split("/");
    userid = params[1]
    console.log("user id: " + userid);
    const usersRef = firestore.collection('users');
    let doc = await usersRef.doc(userid).get();
    if (!doc.exists) {
        response.send({"success": false});
    } else {
        //query for tutor match
        await usersRef.where("user_type","==","tutor").where("minSession", '>=',
            doc.data().minSession).where("minSession", '<=', doc.data().maxSession).get()
        .then((tutorSnapshot) => {
            response.send(tutorSnapshot.docs.map(doc => doc.data()))
         })
        .catch((error) => {
            response.send("Error getting documents: " + error);
        });
    }
});





