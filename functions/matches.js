
const schedule = require('./schedule');
const cors = require('cors');

exports.handler =  async function( request, response, database) {
    response.setHeader('Content-Type', 'application/json')
    const params = request.url.split("/");
    let userid = params[1]
    console.log("user id: " + userid);
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
                console.log(tutorDoc.id, ' => ', tutorDoc.data());
                let s = schedule.match(parentDoc.data(),tutorDoc.data(),1)
                console.log(s);
                tutorDoc.data().availabilityMatch = s;
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