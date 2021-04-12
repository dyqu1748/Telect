var uuid;
var sessions = [];

firebase.auth().onAuthStateChanged(function(user) {
  if (user != null) {
    uuid = user.uid;
    db.collection('users').doc(uuid).get().then((doc) => {
      display_matches(doc.data());
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

                  var all_subjects = "";
                  req_info.session_subject.forEach(function(subject,ind) {
                    all_subjects+=subject_keys[subject];
                    if (ind < req_info.session_subject.length-1){
                      all_subjects+= ', ';
                    }
                  });
                  console.log(req_info);
                  console.log(req_info.session_subject);

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