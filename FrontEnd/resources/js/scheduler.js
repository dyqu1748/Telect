// Get current user
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("User found in scheduler");
      db.collection('users').doc(user.uid).onSnapshot((doc)=> {
          displaySchedule(doc.data().schedule);
      });
    } else {
      console.log("No user signed in");
      location.replace("index.html");
    }
  });


function addItem(id) {
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

  function displaySchedule(schedule) {
      console.log("in display schedule", schedule);
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
  }
