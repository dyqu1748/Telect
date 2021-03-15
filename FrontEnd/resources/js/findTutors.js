var uuid;
firebase.auth().onAuthStateChanged(function(user) {
  if (user != null) {
    uuid = user.uid;
    getMatches()
  } else {
    console.log("USER NOT SIGNED IN");
  }
});

function getMatches() {
//    var getTutorMatches = firebase.functions().httpsCallable('tutorMatches');
//    getTutorMatches()
//      .then((result) => {
//        // Read result of the Cloud Function.
//        var sanitizedMessage = result.data.text;
//        console.log(sanitizedMessage);
//      });
//    $.ajax({
//        url: 'https://us-central1-telect-6026a.cloudfunctions.net/tutorMatches/' + uuid,
//        success : function(data) {
//            console.log(data);
//        }
//    });

    var tutorCard = document.createElement('div')

}