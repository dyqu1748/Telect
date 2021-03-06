/**
 * @index
 * This file contains the firebase cloud unctions.
 *
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const matches = require('./matches');
const locations = require('./locations');
const payments = require('./payments');
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

//serve caller with Telect approved locations as per locations.js
exports.availableLocations = functions.https.onRequest((request, response) => {
    locations.handler(request,response,firestore);
});

//serve caller with tutorMatches as per matches.js
exports.tutorMatches =  functions.https.onRequest( async(request, response) => {
    await matches.handler(request,response,firestore);
});

//serve caller with paywithstripe api as per payments.js
exports.paywithstripe = functions.https.onRequest((request, response) => {
    payments.handler(request,response,firestore);
});

//this function is to help with testing only, do not use in production
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

//serves caller with new messages in chat
exports.notifyNewMessage = functions.firestore
    .document('conversations/{convId}')
    .onWrite((change, context) => {
        //When a message is created or updated, notify the recieving user of a new message.
        const newValue = change.after.exists ? change.after.data() : null;
        const allUsers = newValue.users;
        const conv = context.params.convId;
        //Get the user who sent the newest message
        const newMessageUser = newValue.messages[newValue.messages.length-1].userId;
        console.log(conv,newMessageUser);
        //Send notification to other user about new message.
        if (newMessageUser === allUsers[0]){
            const notifyUser = allUsers[1];
            return firestore.doc('users/'+notifyUser).update({
                "notifications.messages":admin.firestore.FieldValue.arrayUnion(conv)
            });
        }
        else{
            const notifyUser = allUsers[0];
            return firestore.doc('users/'+notifyUser).update({
                "notifications.messages":admin.firestore.FieldValue.arrayUnion(conv)
            });
        }
      });

//serves caller with new session
exports.notifyUserSession = functions.firestore
.document('sessions/{sessID}')
.onWrite((change, context) => {
    //When a session is created/updated/deleted, inform the recieving user.
    const newValue = change.after.exists ? change.after.data() : null;
    const sess = context.params.sessID;

    //Check if session was cancelled.
    if (newValue !== null){
        if (newValue.requested_session === true){
            //Parent requested session.
            const notifyId = newValue.tutor_id;
            //Add time of session to booked time attribute of both users. Ensures of no double-booking
            firestore.doc('users/'+newValue.user_id).update({
                "booked_times":admin.firestore.FieldValue.arrayUnion(newValue.session_time)
            });
            //Send notification to tutor about requested session 
            return firestore.doc('users/'+notifyId).update({
                "booked_times":admin.firestore.FieldValue.arrayUnion(newValue.session_time),
                "notifications.sessions":admin.firestore.FieldValue.arrayUnion(sess)
            });

        }
        else{
            //Tutor acepted session
            const notifyId = newValue.user_id;
            //Add time of session to booked time attribute of both users. Ensures of no double-booking
            firestore.doc('users/'+newValue.tutor_id).update({
                "booked_times":admin.firestore.FieldValue.arrayUnion(newValue.session_time)
            });
            //Send notification to parent about accepted session 
            return firestore.doc('users/'+notifyId).update({
                    "booked_times":admin.firestore.FieldValue.arrayUnion(newValue.session_time),
                    "notifications.sessions":admin.firestore.FieldValue.arrayUnion(sess)
            });
        }
    }
    else{
        //Session canceled. Removed booked time from both users.
        const oldDocument = change.before.data();
        firestore.doc('users/'+oldDocument.user_id).update({
            "booked_times":admin.firestore.FieldValue.arrayRemove(oldDocument.session_time)
        });
        return firestore.doc('users/'+oldDocument.tutor_id).update({
            "booked_times":admin.firestore.FieldValue.arrayRemove(oldDocument.session_time)
        });
    }
});






