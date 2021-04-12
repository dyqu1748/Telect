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

exports.notifyNewMessage = functions.firestore
    .document('conversations/{convId}')
    .onWrite((change, context) => {
        const newValue = change.after.exists ? change.after.data() : null;
        const allUsers = newValue.users;
        const conv = context.params.convId;
        const newMessageUser = newValue.messages[newValue.messages.length-1].userId;
        console.log(conv,newMessageUser);
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

exports.notifyUserSession = functions.firestore
.document('sessions/{sessID}')
.onWrite((change, context) => {
    const newValue = change.after.exists ? change.after.data() : null;
    const sess = context.params.sessID;
    if (newValue === null){
        //Tutor rejected session; update parent
        const oldDocument = change.before.data();
        const notifyId = oldDocument.user_id;
        return firestore.doc('users/'+notifyId).update({
            "notifications.sessions":admin.firestore.FieldValue.arrayUnion([sess,false])
        });
    }
    else{
        if (newValue.requested_session === true){
            //Parent requested session: Notify tutor
            const notifyId = newValue.tutor_id;
            //REMINDER: Need to test to make sure it doesn't overwrite message notification
            return firestore.doc('users/'+notifyId).update({
                "notifications.sessions":admin.firestore.FieldValue.arrayUnion(sess)
            });

        }
        else if (newValue.accepted_session === true){
            //Tutor acepted session: Notify parent
            const notifyId = newValue.user_id;
            return firestore.doc('users/'+notifyId).update({
                    "notifications.sessions":admin.firestore.FieldValue.arrayUnion([sess,true])
            });
        }
    }
});






