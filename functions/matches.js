
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
            tutorSnapshot.forEach((tutorDoc) => {
                // look for two consecutive time matches
                parentAvail = parentDoc.data().availability
                Object.keys(parentAvail).forEach(key => {
                    parentDay = key
                    times = parentAvail[key]
                    Object.keys(times).forEach(key => {
                        console.log(times[key])
                        parentTime = times[key]
                        // Check for this combination in the tutor set

                    });
                });
            });
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
};