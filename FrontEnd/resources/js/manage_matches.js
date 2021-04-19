var uuid;
var sessions = [];

firebase.auth().onAuthStateChanged(function(user) {
  if (user != null) {
    uuid = user.uid;
    db.collection('users').doc(uuid).onSnapshot((doc) => {
      display_matches(doc.data());
      if (doc.data().notifications.sess_cancel !== undefined){
        display_canceled_sess(doc.data());
      }
    })
  } else {
    console.log("No user signed in");
    location.replace("index.html");
  }
});

// map for formatting subjects
var subject_keys = {'math':'Math','geometry':'Geometry','pre-algebra':'Pre-Algebra','algebra':'Algebra','science':'Science','geology':'Geology','chemistry':'Chemistry','social_studies':'Social Studies','govtHist': 'U.S. Government and History','language_arts':'Language Arts','spanish': 'Spanish'};

// define modal
var cancelSessionModal = $("#cancel-session");
var span1 = document.getElementById("close-cancel");
span1.onclick = function() {
  $("#current-matches").removeClass("dialogIsOpen");
  $("#footer").removeClass("dialogIsOpen");
  $("nav").removeClass("dialogIsOpen");
  cancelSessionModal.fadeOut('fast');
}

// close modal
window.onclick = function(event) {
  if (event.target.id == cancelSessionModal.attr('id')) {
	$("#current-matches").removeClass("dialogIsOpen");
	$("#footer").removeClass("dialogIsOpen");
	$("nav").removeClass("dialogIsOpen");
    scheduleModal.fadeOut('fast');
  }
}

// function gets tutor matches for current user and displays them all
function display_matches(data) {
    var currentUserLabel = (data.user_type =="parent") ? "user_id" : "tutor_id";
    var otherUserLabel = (data.user_type =="parent") ? "tutor_id" : "user_id";
    var html = ``;

    // get all sessions with current user that are accepted
    db.collection('sessions').where(currentUserLabel, "==", uuid).where("accepted_session", "==", true).get().then((doc) =>
    {
      if (doc.empty) {
        // error handling: user has no upcoming sessions
        html+=`<h1 class="text-center">No Sessions to Manage</h1>`;
        $('#current-matches').html(html);
      }
      else {
        html+=`<h1 class="text-center">Manage Your Upcoming Sessions</h1><br>`;
      }

      doc.forEach(req =>
      {
        db.collection('users').doc(uuid).update({
          "notifications.sessions":firebase.firestore.FieldValue.arrayRemove(req.id)
        });
        var req_info = req.data();
        sessions.push(req_info);
        db.collection('users').doc(req_info[otherUserLabel]).get().then((match) => {
                html += `
                <div class="form-group row" id="req_${req.id}">
                <div class="card w-75 mx-auto">
                    <div class="card-body">
                        <h5 class="card-title"> ${match.data().first_name} ${match.data().last_name}</h5>
                        <div class="row">
                            <div class="col">`;

                  // format time to look nice
                  var day = req_info.session_time.match(/[a-zA-Z]+/g);
                  var time = String(req_info.session_time.match(/\d+/g));
                  if (parseInt(time) >= 1200){
                  if (parseInt(time) >= 1300){
                      time = String(parseInt(time)-1200);
                    }
                    time += " P.M."
                  }
                  else{
                    if (parseInt(time) < 1000){
                      time = time.substring(1);
                    }
                    time +=  " A.M.";
                  }
                  time = time.replace(/(?=.{7}$)/,':');

                  var all_subjects = "";
                  req_info.session_subject.forEach(function(subject,ind) {
                    all_subjects+=subject_keys[subject];
                    if (ind < req_info.session_subject.length-1){
                      all_subjects+= ', ';
                    }
                  });

                  if (data.user_type == "parent") {
                    html += `<img src= ${match.data().photoUrl} class="tutorPhoto">`
                  }
                  html += `
                      </br>
                      <button onclick="cancel_session('${req.id}','${data.user_type}')" class="btn btn-primary rounded-pill">Cancel Session</button>
                      </br>`;

                  html += ` </br>
                              </div>
                              <div class="col">
                                  <p class="card-text"> Date and Time: ${day} ${time} </p>
                                  <p class="card-text"> Location: ${req_info.session_loc.charAt(0).toUpperCase() +req_info.session_loc.slice(1)} </p>
                                  <p class="card-text"> Session Cost: ${"$" + req_info.session_cost}</p>
                                  <p class="card-text"> Subjects: ${all_subjects}</p>
                                  <p class="card-text"> Child: ${req_info.selected_child} </p>
                              </div>
                          </div>
                      </div>
                    </div>
                    </div>
                  `;

          $('#current-matches').html(html);
        });
      });
    });

    $('#loading_icon').fadeOut("fast");
    $('#page-container').fadeIn("slow");
    return true;

 }

// cancel a session on manage matches page
function cancel_session(i,user_type) {
    db.collection('sessions').doc(i).get().then((doc)=>{
      var sessInfo = doc.data();
      var html = `<br><div class="alert alert-success alert-dismissible fade show" role="alert">
      The session has been successfully canceled.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`;
    $('#content-wrap').prepend(html);
      if (user_type == "parent"){
        db.collection('users').doc(sessInfo.tutor_id).update({
          "notifications.sess_cancel": firebase.firestore.FieldValue.arrayUnion(sessInfo)
        });
      }
      else{
        db.collection('users').doc(sessInfo.user_id).update({
          "notifications.sess_cancel": firebase.firestore.FieldValue.arrayUnion(sessInfo)
        });
      }
    }).then(()=>{
      db.collection('sessions').doc(i).delete().then(()=>{
            console.log("Session Deleted");
          }).catch((error)=>{
            console.log("Error deleting session: ", error);
          });
    }).catch((error)=>{
      console.log(error);
    });
    $('#req_'+i).fadeOut(300,function(){this.remove();});
}

// function displays cancelled session and updates notifications
function display_canceled_sess(data){
  data.notifications.sess_cancel.forEach(function(session){
    if (data.user_type == "tutor"){
      db.collection('users').doc(session.user_id).get().then((otherUser)=>{
        var otherUserData = otherUser.data();
        var day = session.session_time.match(/[a-zA-Z]+/g);
        var time = String(session.session_time.match(/\d+/g));
        if (parseInt(time) >= 1200){
          if (parseInt(time) >= 1300){
            time = String(parseInt(time)-1200);
          }
          time += " P.M."
        }
        else{
          if (parseInt(time) < 1000){
            time = time.substring(1);
          }
          time +=  " A.M.";
        }
        time = time.replace(/(?=.{7}$)/,':');
        var html = `
              <br><div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Attention!</strong> ${otherUserData.first_name} ${otherUserData.last_name} has canceled the ${day}, ${time} session with you.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              `;
        $('#content-wrap').prepend(html);
      })
    }
    else{
      db.collection('users').doc(session.tutor_id).get().then((otherUser)=>{
        var otherUserData = otherUser.data();
        var day = session.session_time.match(/[a-zA-Z]+/g);
        var time = String(session.session_time.match(/\d+/g));
        if (parseInt(time) >= 1200){
          if (parseInt(time) >= 1300){
            time = String(parseInt(time)-1200);
          }
          time += " P.M."
        }
        else{
          if (parseInt(time) < 1000){
            time = time.substring(1);
          }
          time +=  " A.M.";
        }
        time = time.replace(/(?=.{7}$)/,':');
        var html = `
              <br>
              <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Attention!</strong> ${otherUserData.first_name} ${otherUserData.last_name} has declined/canceled your ${day}, ${time} session.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              `;
        $('#content-wrap').prepend(html);
      })

    }
  });
  db.collection('users').doc(uuid).update({
    "notifications.sess_cancel":[]
  });
}