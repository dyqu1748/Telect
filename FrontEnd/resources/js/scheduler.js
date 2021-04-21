// Get current user
var uuid;
var userData;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      uuid = user.uid;
      console.log("User found in scheduler");
      db.collection('users').doc(user.uid).onSnapshot((doc)=> {
          userData = doc.data();
          displaySchedule(doc.data());
      });
    } else {
      console.log("No user signed in");
    }
  });

// map for formatting subjects
var subject_keys = {'math':'Math','geometry':'Geometry','pre-algebra':'Pre-Algebra','algebra':'Algebra','science':'Science','geology':'Geology','chemistry':'Chemistry','social_studies':'Social Studies','govtHist': 'U.S. Government and History','language_arts':'Language Arts','spanish': 'Spanish'};

// define modal and close button on modal
var sessionInfoModal = $("#more-info-session");
var closeSpan = document.getElementById("close-session-info");
closeSpan.onclick = function() {
  $("#footer").removeClass("dialogIsOpen");
  $("nav").removeClass("dialogIsOpen");
  $("#view-schedule-header").removeClass("dialogIsOpen");
  $("#scheduler").removeClass("dialogIsOpen");
  $("#table").removeClass("dialogIsOpen");
  sessionInfoModal.fadeOut('fast');
}

// onclick function that allows the user to select day/time on schedule UI
function addItem(id) {
    if(document.getElementById(id).className == "scheduler_item") {
        document.getElementById(id).className = "scheduler_item_selected";
    } else if (document.getElementById(id).className == "scheduler_item_selected") {
        document.getElementById(id).className = "scheduler_item";
    }
}

//function goes through all of the divs on the page and stores all of the days and times that a user has selected into a dcitionary
function getScheduleDays() {
    var divs = document.getElementsByTagName("div");
    var days = []; 
    var schedule = {
        "Monday": [],
        "Tuesday": [],
        "Wednesday": [], 
        "Thursday": [],
        "Friday": [],
        "Saturday": [], 
        "Sunday": []
    };
    for(var i = 0; i < divs.length; i++) {
        if (divs[i].className == "scheduler_item_selected") {
            days.push(divs[i].id);
        }   
     }

     for(var i = 0; i < days.length; i++) {
         day_time = days[i].split("_");
         day = day_time[0];
         time = day_time[1];
        schedule[day].push(time); 
     }

     var scheduleJSON = JSON.stringify(schedule);
     return [scheduleJSON,schedule];
}

//function displays schedule in signup review by combining day and time from schedule dict and finding that id in html
function displayScheduleReview(schedule) {
    schedule_dict = JSON.parse(schedule);
    console.log("schedule dict: ", schedule_dict);
    for(var day in schedule_dict) { 
        if(schedule_dict[day].length != 0) {
            for(var time in schedule_dict[day]) {
                var id = day + "_" + schedule_dict[day][time] + "_review";
                console.log(id);
                if(document.getElementById(id).className == "scheduler_item_review"){
                    document.getElementById(id).className = "scheduler_item_review_selected";
                }
            }
        }
    }
}

function checkScheduleReq(schedule){
    var availFill = false;
    Object.keys(schedule).forEach(function(day){
      if (schedule[day].length > 0){
        availFill=true;
      }
    })
    return availFill;
  }

  // function displays schedule by getting id of day/time div and changing its color
  function displaySchedule(data) {
      console.log("in display schedule", data.schedule);
      schedule = data.schedule;
      for( var day in schedule) {
        if(schedule[day].length != 0) {
            for(var time in schedule[day]) {
                //console.log("splitting day and time", day, schedule_dict[day][time]);
                var id = day + "_" + schedule[day][time];
                console.log(id);
                if(document.getElementById(id).className == "scheduler_item_view"){
                    document.getElementById(id).className = "scheduler_item_view_selected";
                }
            }
        }
      }

      // get upcoming sessions to display on view schedule
      var currentUserLabel = (data.user_type =="parent") ? "user_id" : "tutor_id";
      var otherUserLabel = (data.user_type =="parent") ? "tutor_id" : "user_id";
      db.collection('sessions').where(currentUserLabel, "==", uuid).get().then((doc) =>
      {
        if (!doc.empty) {
            doc.forEach(session => {
              var session_info = session.data();
              var schedule_id = session_info.session_time.slice(0, session_info.session_time.length - 4)  + "_" + session_info.session_time.slice(-4);

              if (session_info.accepted_session == true) {
                if(document.getElementById(schedule_id).className == "scheduler_item_view_selected") {
                  document.getElementById(schedule_id).className = "scheduler_item_accepted_session";
                  document.getElementById(schedule_id).setAttribute("onclick", "showSessionInfo(this.id)");
                }
              } else {
                if(document.getElementById(schedule_id).className == "scheduler_item_view_selected") {
                  document.getElementById(schedule_id).className = "scheduler_item_awaiting_session";
                  document.getElementById(schedule_id).setAttribute("onclick", "showSessionInfo(this.id)");
                }
              }

            });
        }
      });
    $('#loading_icon').fadeOut("fast");
    $('#page-container').fadeIn("slow");
  }

// populates dropdown with information about the session that the user selected
function showSessionInfo(id) {
    $("#footer").addClass("dialogIsOpen");
    $("nav").addClass("dialogIsOpen");
    $("#view-schedule-header").addClass("dialogIsOpen");
    $("#scheduler").addClass("dialogIsOpen");
    $("#table").addClass("dialogIsOpen");
    sessionInfoModal.fadeIn();

    var currentUserLabel = (userData.user_type =="parent") ? "user_id" : "tutor_id";
    var otherUserLabel = (userData.user_type =="parent") ? "tutor_id" : "user_id";

    var html = ``;
    var modifiedId = id.replace("_", "");
    db.collection('sessions').where(currentUserLabel, "==", uuid).where("session_time", "==", modifiedId).get().then((doc) =>
    {
      doc.forEach(req =>
      {
        var req_info = req.data();
        db.collection('users').doc(req_info[otherUserLabel]).get().then((match) => {

                html += `
                <div class="form-group row" id="req_${req.id}">
                <div class="card w-75 mx-auto">
                    <div class="card-body">
                        <h5 class="card-title"> ${match.data().first_name} ${match.data().last_name}</h5>
                        <div class="row">
                            <div class="col">`;

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

                  if (userData.user_type == "parent") {
                    html += `<img src= ${match.data().photoUrl} class="tutorPhoto">`
                  }

                  if (req_info.accepted_session == true) {
                    html += `
                          </br>
                          <button onclick="goToManageMatches()" class="btn btn-primary rounded-pill">Cancel Session</button>
                          </br>`;
                  } else {
                    html += `
                          </br>
                          <button onclick="goToManageMatches()" class="btn btn-primary rounded-pill" disabled> Request Pending</button>
                          </br>`;
                  }

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

          $('#session-info').html(html);
        });
      });
    });
}

// if user wants to cancel a session, they will be rerouted to manage sessions page
function goToManageMatches() {
    location.replace("manage_matches.html");
}


