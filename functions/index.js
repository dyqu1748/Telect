const functions = require("firebase-functions");

// Set the configuration for your app
  // TODO: Replace with your project's config object
 var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
 firebase.initializeApp(firebaseConfig)

// Get a reference to the database service
  var database = firebase.database();

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.activeLocations = functions.https.onRequest((request, response) => {
  functions.logger.info("Begin: activeLocations", {structuredData: true});

  response.send("Hello from Firebase!");
  functions.logger.info("End: activeLocations", {structuredData: true});
});