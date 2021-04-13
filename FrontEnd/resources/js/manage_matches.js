var uuid;
var sessions = [];

firebase.auth().onAuthStateChanged(function(user) {
  if (user != null) {
    uuid = user.uid;
    db.collection('users').doc(uuid).get().then((doc) => {
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

var subject_keys = {'math':'Math','geometry':'Geometry','pre-algebra':'Pre-Algebra','algebra':'Algebra','science':'Science','geology':'Geology','chemistry':'Chemistry','social_studies':'Social Studies','govtHist': 'U.S. Government and History','language_arts':'Language Arts','spanish': 'Spanish'};

var cancelSessionModal = $("#cancel-session");
var span1 = document.getElementById("close-cancel");
span1.onclick = function() {
  $("#current-matches").removeClass("dialogIsOpen");
  $("#footer").removeClass("dialogIsOpen");
  $("nav").removeClass("dialogIsOpen");
  cancelSessionModal.fadeOut('fast');
}

window.onclick = function(event) {
  if (event.target.id == cancelSessionModal.attr('id')) {
	$("#current-matches").removeClass("dialogIsOpen");
	$("#footer").removeClass("dialogIsOpen");
	$("nav").removeClass("dialogIsOpen");
    scheduleModal.fadeOut('fast');
  }
}

function display_matches(data) {
    console.log(data.user_type);
    var currentUserLabel = (data.user_type =="parent") ? "user_id" : "tutor_id";
    console.log(currentUserLabel);
    var otherUserLabel = (data.user_type =="parent") ? "tutor_id" : "user_id";
    console.log(otherUserLabel);

    var html = ``;
    var i = 0;
    db.collection('sessions').where(currentUserLabel, "==", uuid).where("accepted_session", "==", true).get().then((doc) =>
    {
      doc.forEach(req =>
      {
        db.collection('users').doc(uuid).update({
          "notifications.sessions":firebase.firestore.FieldValue.arrayRemove(req.id)
        });
        var req_info = req.data();
        sessions.push(req_info);
        db.collection('users').doc(req_info[otherUserLabel]).get().then((match) => {
            console.log(match.data());
                console.log("here");
                html += `
                  <div class="card w-75">
                    <div class="card-body">
                        <h5 class="card-title"> ${match.data().first_name} ${match.data().last_name}</h5>
                        <div class="row">
                            <div class="col">`;

                  var time = req_info.session_time.slice(-4)
                  var printedTime = time.slice(0,2) + ":" + time.slice(2,4);
                  var formattedDateTime = req_info.session_time.slice(0, req_info.session_time.length - 4) + " " + printedTime;

                  var all_subjects = subject_keys[req_info.session_subject];
//                  req_info.session_subject.forEach(function(subject,ind) {
//                    all_subjects+=subject_keys[subject];
//                    if (ind < tutorData.subjects.length-1){
//                      all_subjects+= ', ';
//                    }
//                  });
                  console.log(all_subjects);

                  if (data.user_type == "parent") {
                    html += `<img src= ${match.data().photoUrl} class="tutorPhoto">`
                  }
                  html += `
                      </br>
                      <button onclick="cancel_session(${i})" class="btn btn-primary">Cancel Session</button>
                      </br>`;

                  html += ` </br>
                              </div>
                              <div class="col">
                                  <p id="selected_tutor_${i}" style="display: none;">${i}</p>
                                  <p class="card-text"> Date and Time: ${formattedDateTime} </p>
                                  <p class="card-text"> Location: ${req_info.session_loc} </p>
                                  <p class="card-text"> Session Cost: ${"$" + req_info.session_cost}</p>
                                  <p class="card-text"> Subjects: ${all_subjects}</p>
                                  <p class="card-text"> Child: ${req_info.selected_child} </p>
                              </div>
                          </div>
                      </div>
                    </div>
                  `;
                  i++;

          $('#current-matches').html(html);
        });
      });
    });

    $('#loading_icon').fadeOut("fast");
    $('#page-container').fadeIn();
    return true;

 }

function cancel_session(i) {
    console.log("in cancel session");
    cancelSessionModal.fadeIn();
    $('#loading_icon_modal').css("display","block");
    $("nav").addClass("dialogIsOpen");
    $("#footer").addClass("dialogIsOpen");
    $("#current-matches").addClass("dialogIsOpen");
    var tutor = document.getElementById("selected_tutor_"+i).innerHTML;

    console.log(sessions[tutor]);
    db.collection('sessions').where("tutor_id", "==", sessions[tutor].tutor_id)
        .where("user_id", "==", sessions[tutor].user_id).where("session_time", "==", sessions[tutor].session_time).get()
          .then(snapshot => {
                snapshot.forEach(doc => {
                  db.collection('users').doc(sessions[tutor].tutor_id).update({
                    "notifications.sess_cancel": firebase.firestore.FieldValue.arrayUnion(doc.data())
                  });
                  var deleteDoc = db.collection('sessions').doc(doc.id).delete();
                });
              })
              .catch(err => {
                console.log('Error getting documents', err);
              });
    var html = ``;
    html += `
        <h1> Session Cancelled </h1>
        <button onclick="refresh_sessions()" class="btn btn-primary">Ok</button>
        `;
    $("#temp-info").html(html);
}

function refresh_sessions() {
    db.collection('users').doc(uuid).get().then((doc) => {
           display_matches(doc.data());
         })
    cancelSessionModal.fadeOut('fast');
    $("#current-matches").removeClass("dialogIsOpen");
    $("#footer").removeClass("dialogIsOpen");
    $("nav").removeClass("dialogIsOpen");
}

function display_canceled_sess(data){
  console.log("START");
  console.log(data);
  data.notifications.sess_cancel.forEach(function(session){
    if (data.user_type == "tutor"){
      db.collection('users').doc(session.user_id).get().then((otherUser)=>{
        var otherUserData = otherUser.data();
        var day = session.session_time.match(/[a-zA-Z]+/g);
        var time = String(session.session_time.match(/\d+/g));
        if (parseInt(time) >= 1300){
          time = String(parseInt(time)-1200) + " P.M.";
        }
        else{
          time = time + " A.M.";
        }
        time = time.replace(/(?=.{7}$)/,':');
        var html = `
              <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Attention!</strong> ${otherUserData.first_name} ${otherUserData.last_name} has declined/canceled the ${day}, ${time} session with you.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              `;
        console.log(html);
        $('#current-matches').prepend(html);
      })
    }
    else{
      db.collection('users').doc(session.tutor_id).get().then((otherUser)=>{
        var otherUserData = otherUser.data();
        console.log(otherUserData);
        var day = session.session_time.match(/[a-zA-Z]+/g);
        var time = String(session.session_time.match(/\d+/g));
        if (parseInt(time) >= 1300){
          time = String(parseInt(time)-1200) + " P.M.";
        }
        else{
          time = time + " A.M.";
        }
        time = time.replace(/(?=.{7}$)/,':');
        var html = `
              <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Attention!</strong> ${otherUserData.first_name} ${otherUserData.last_name} has canceled their ${day}, ${time} session with you.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              `;
        console.log(html);
        $('#current-matches').prepend(html);
      })

    }
  });
  db.collection('users').doc(uuid).update({
    "notifications.sess_cancel":[]
  });
}