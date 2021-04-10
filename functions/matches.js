
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
        await usersRef.where("user_type","==","tutor").where("minSession", '>=',
            parentDoc.data().minSession).where("minSession", '<=', parentDoc.data().maxSession).get()
        .then((tutorSnapshot) => {
            matchingTutors = [];
            tutorSnapshot.forEach((tutorDoc) => {
                // look for two consecutive time matches
                i = 0
                parentAvail = parentDoc.data().schedule
                tutorAvail = tutorDoc.data().schedule
                matchingTimes = []
                Object.keys(parentAvail).forEach(key => {
                    parentDay = key
                    if (tutorAvail.hasOwnProperty(parentDay)) {
                        parentTimes = parentAvail[parentDay]
                        tutorTimes = tutorAvail[parentDay]
                        Object.keys(parentTimes).forEach(key => {
                            parentTime = parentTimes[key]
                            Object.keys(tutorTimes).forEach(key => {
                                if (parentTime == tutorTimes[key]) {
                                    console.log(parentDay + "_" + parentTime)
                                    matchingTimes.push(parentDay + "_" + parentTime)
                                }
                            });
                        });
                    }
                });
                if (matchingTimes.length > 0) {
                    let tutor = tutorDoc.data()
                    tutor['matchingtimes'] = matchingTimes
                    matchingTutors.push(tutor)
                }
                i++
            });
            cors()(request, response, () => {
                if (matchingTutors.length > 0 ) {
                    response.send(matchingTutors)
                }
                else {
                    response.send ("{No matching tutors found.}")
                }
            });
         })
        .catch((error) => {
            cors()(request, response, () => {
                response.send("Error getting documents: " + error);
            });
        });
    }
};