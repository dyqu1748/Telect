
const cors = require('cors');

exports.handler = function(request, response, database) {
    cors()(request, response, () => {
        const params = request.url.split("/");
        response.setHeader('Content-Type', 'application/json')
        return database.collection('locations').where('state','==',params[1]).where('city','==',params[2]).get().then((snapshot) => {
            if (!snapshot.empty) {
                // doc.data() is never undefined for query doc snapshots
                response.send({"success": true})
            } else {
            response.send({"success": false});
            }
        });
    });
};