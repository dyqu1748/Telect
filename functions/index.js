const functions = require("firebase-functions");
const admin = require("firebase-admin");
const schedule = require('schedulejs');
const later = require('later');
const cors = require('cors');

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
    cors()(request, response, () => {
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

});

exports.tutorMatchesOld =  functions.https.onRequest(async (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    const params = request.url.split("/");
    let userid = params[1]
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

exports.tutorMatches =  functions.https.onRequest( async(request, response) => {
    response.setHeader('Content-Type', 'application/json')
    const params = request.url.split("/");
    let userid = params[1]
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
            cors()(request, response, () => {
                response.send(tutorSnapshot.docs.map(doc => doc.data()))
            });
         })
        .catch((error) => {
            cors()(request, response, () => {
                response.send("Error getting documents: " + error);
            });
        });
    }
});

// To make schedules easier to read, we'll be using the text parser from later,
// if you manually specify the later schedules, you don't need to require it here

p = later.parse.text;

// Step 1: Define the work items (tasks), property names don't matter at this
// point, we'll fix them up later using schedule.task
const workItems = [
    {
        name: '2 hours geometry session',
        length: 2,                      // lengths specified in hours
        minSchedule: 2,                 // have to schedule all 2 hours at once
        assignedTo: ['Student', 'Tutor'],    // both Bob and Sara are needed
        availability: 'after 8:00am and before 9:00pm'
        //can only complete when paint store is open
    }
];

// Step 2: Define our resources, we'll fix up property names with schedule.resources
const people = [
    {
        name: 'Student',
        // Student likes to sleep in a bit on the weekends
        availability: 'every weekend after 10:00am and before 6:00pm'
    },
    {
        name: 'Tutor',
        // Tutor gets up earlier but has plans Saturday afternoon so we note that in her availability
        availability: 'every weekend after 8:00am and before 6:00pm except on Sat after 1:00pm and before 4:00pm'
    }
];

// Step 3: Tasks aren't in the right format, need to create a generator
const t = schedule.tasks()
    .id(function (d) {
        return d.name;
    })
    // our length is in hours, convert to minutes
    .duration(function (d) {
        return d.length * 60;
    })
    // use later.parse.text to parse text into a usable schedule
    .available(function (d) {
        return d.availability ? p(d.availability) : undefined;
    })
    // convert minSchedule to minutes
    .minSchedule(function (d) {
        return d.minSchedule ? d.minSchedule * 60 : undefined;
    })
    // resources are the people the tasks have been assigned to
    .resources(function (d) {
        return d.assignedTo;
    });

const tasks = t(workItems);

// Step 4: Resources aren't in the right format either, need to create a generator
const r = schedule.resources()
    .id(function (d) {
        return d.name;
    })
    .available(function (d) {
        return d.availability ? p(d.availability) : undefined;
    });

const resources = r(people);

// Step 5: Pick a start date for the schedule and set correct timezone
const start = new Date(2021, 3, 11);
schedule.date.localTime();

exports.scheduleTest =  functions.https.onRequest(async (request, response) => {
    response.setHeader('Content-Type', 'application/json')

    // Step 6: Create the schedule
    const s = schedule.create(tasks, resources, null, start);
    response.send({"schedule": s})
});







