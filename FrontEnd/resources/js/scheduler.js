// Get current user
var sessionsData = [];
var uuid;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      uuid = user.uid;
      console.log("User found in scheduler");
      db.collection('users').doc(user.uid).onSnapshot((doc)=> {
//          getSessions(doc.data());
          displaySchedule(doc.data());
      });
    } else {
      console.log("No user signed in");
//      location.replace("index.html");
    }
  });


function getSessions(data) {
    var currentUserLabel = (data.user_type =="parent") ? "user_id" : "tutor_id";
    var otherUserLabel = (data.user_type =="parent") ? "tutor_id" : "user_id";

    db.collection('sessions').where(currentUserLabel, "==", uuid).where("accepted_session", "==", true).get().then((doc) =>
    {
      if (doc.empty){
        // no sessions
        sessionsData = {};
        return false;
      }

      doc.forEach(req =>
      {
        var req_info = req.data();
//        sessionsData.push(req_info);
        db.collection('users').doc(req_info[otherUserLabel]).get().then((match) => {
            req_info["matchData"] = match.data();
            sessionsData.push(req_info);
        });
      });
    });
    return true;
}

function addItem(id) {
    if(document.getElementById(id).className == "scheduler_item") {
        document.getElementById(id).className = "scheduler_item_selected";
    } else if (document.getElementById(id).className == "scheduler_item_selected") {
        document.getElementById(id).className = "scheduler_item";
    }
}

function addItemViewSchedule(id) {
    if(document.getElementById(id).className == "scheduler_item") {
        document.getElementById(id).className = "scheduler_item_selected";
    } else if (document.getElementById(id).className == "scheduler_item_selected") {
        document.getElementById(id).className = "scheduler_item";
    }
}

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

function displayScheduleReview(schedule) {
    //console.log("in display schedule review");
    //console.log("schedule", schedule);
    schedule_dict = JSON.parse(schedule);
    console.log("schedule dict: ", schedule_dict);
    for(var day in schedule_dict) { 
        if(schedule_dict[day].length != 0) {
            for(var time in schedule_dict[day]) {
                //console.log("splitting day and time", day, schedule_dict[day][time]);
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

      // get sessions
      var currentUserLabel = (data.user_type =="parent") ? "user_id" : "tutor_id";
      var otherUserLabel = (data.user_type =="parent") ? "tutor_id" : "user_id";
      console.log("get sessions");
      db.collection('sessions').where(currentUserLabel, "==", uuid).get().then((doc) =>
      {
        if (!doc.empty) {
            doc.forEach(session => {
              var session_info = session.data();
              console.log(session_info);
              var schedule_id = session_info.session_time.slice(0, session_info.session_time.length - 4)  + "_" + session_info.session_time.slice(-4);
              console.log(schedule_id);

              if (session_info.accepted_session == true) {
                if(document.getElementById(schedule_id).className == "scheduler_item_view_selected"){
                  document.getElementById(schedule_id).className = "scheduler_item_accepted_session";
                }
              } else {
                if(document.getElementById(schedule_id).className == "scheduler_item_view_selected"){
                  document.getElementById(schedule_id).className = "scheduler_item_awaiting_session";
                }
              }

              db.collection('users').doc(session_info[otherUserLabel]).get().then((match) => {
                console.log(match.data());
              });
            });
        }
      });
  }
