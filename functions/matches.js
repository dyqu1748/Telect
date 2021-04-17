
const cors = require('cors');

exports.handler =  async function( request, response, database) {
    response.setHeader('Content-Type', 'application/json')
    const params = request.url.split("/");
    let userid = params[1]
    const usersRef = database.collection('users');
    let parentDoc = await usersRef.doc(userid).get();
    if (!parentDoc.exists) {
        response.send({"success": false});
    } else {
        //query for tutor match
        let tutorSnapshot = await usersRef.where("user_type","==","tutor").where("minSession", '<=', parentDoc.data().maxSession).get()
        try {
            matchingTutors = [];
            let tutorDoc;
            for (tutorDoc of tutorSnapshot.docs) {
                // look for two consecutive time matches
                i = 0
                parentAvail = parentDoc.data().schedule
                tutorAvail = tutorDoc.data().schedule
                //parentAvail = parentDoc.data().availability
                //tutorAvail = tutorDoc.data().availability
                //console.log("tutorAvail: " + JSON.stringify(tutorDoc.data()))
                //console.log("tutorAvail: " + JSON.stringify(tutorAvail))
                matchingTimes = []
                for (let parentAvailKey of Object.keys(parentAvail)) {
                    let parentDay = parentAvailKey
                    let parentTime;
                    let tutorTimes;
                    let parentTimes;
                    console.log("tutorAvail: " + tutorAvail)
                    if (tutorAvail.hasOwnProperty(parentDay)) {
                        parentTimes = parentAvail[parentDay]
                        tutorTimes = tutorAvail[parentDay]
                        for (let parentTimeKey of Object.keys(parentTimes)) {
                            parentTime = parentTimes[parentTimeKey]
                            for (let tutorTimeKey in Object.keys(tutorTimes)) {
                                let sessionMatch = false;
                                let sessionSnapshot;
                                if (parentTime === tutorTimes[tutorTimeKey]) {
                                    console.log(parentDay + "_" + parentTime)
                                    //check if there is already a session for this user, this tutor
                                    const sessionsRef = database.collection('sessions');
                                    console.log(parentDay + "_" + parentTime)
                                    sessionSnapshot = await sessionsRef.where("user_id", "==", userid).where("tutor_id", "==", tutorDoc.id).where('session_time', "==", parentDay + parentTime).get()
                                    for (let sessionDoc of sessionSnapshot.docs) {
                                        // doc.data() is never undefined for query doc snapshots
                                        console.log(sessionDoc.id, " => ", sessionDoc.data);
                                        console.log("sessionMatch for: " + userid + ", tutor_id: " + tutorDoc.id + ", and time: " + parentDay + "_" + parentTime)
                                        sessionMatch = true
                                    }
                                    //console.log("sessionMatch: " + sessionMatch + " sessionTime: " + parentDay + "_" + parentTime)
                                    if (!sessionMatch) {
                                        matchingTimes.push(parentDay + "_" + parentTime)
                                    }
                                }
                            }
                        }
                    }
                }
                console.log("matchingTimes.length: " + matchingTimes.length)
                if (matchingTimes.length > 0) {
                    let tutor = tutorDoc.data()
                    tutor['matchingtimes'] = matchingTimes
                    matchingTutors.push(tutor)
                }
                i++
            }
            cors()(request, response, () => {
                if (matchingTutors.length > 0 ) {
                    response.send(matchingTutors)
                }
                else {
                    response.send ("{No matching tutors found.}")
                }
            });
         }
        catch(error) {
            cors()(request, response, () => {
                response.send("Error getting documents: " + error);
            });
        }
    }
};