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
      //console.log("in display schedule", schedule);
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

  function editSchedule() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("User found in scheduler");
          db.collection('users').doc(user.uid).onSnapshot((doc)=> {
              schedule = doc.data().schedule;
              console.log("schedule in edit schedule", schedule);
              editScheduleHelper(schedule);
              
          });
        } else {
          console.log("No user signed in");
          location.replace("index.html");
        }
      }); 
  }

  function editScheduleHelper(schedule) {
    document.getElementById("edit").style.display = 'none';

    var button_html = `
    <input id = "edit" type="button" class="btn btn-lg btn-secondary rounded-pill" onclick="saveSchedule()" value="Save Schedule"/>
    `
    console.log(button_html); 

    document.getElementById("edit_form").innerHTML = button_html; 

    var schedule_html =   `
    <div class = "free_space">     </div>
    <div class = "days">Monday</div>
    <div class = "days">Tuesday</div>
    <div class = "days">Wednesday</div>
    <div class = "days">Thursday</div>
    <div class = "days">Friday</div>
    <div class = "days">Saturday</div>
    <div class = "days">Sunday</div>
    <div class = "times">8:00 a.m.</div>
    <div class = "scheduler_item" id = "Monday_0800" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_0800" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_0800" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_0800" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_0800" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_0800" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_0800" onclick="addItem(this.id)">     </div>
    <div class = "times">8:30 a.m.</div>
    <div class = "scheduler_item" id = "Monday_0830" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_0830" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_0830" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_0830" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_0830" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_0830" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_0830" onclick="addItem(this.id)">     </div>
    <div class = "times">9:00 a.m.</div>
    <div class = "scheduler_item" id = "Monday_0900" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_0900" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_0900" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_0900" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_0900" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_0900" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_0900" onclick="addItem(this.id)">     </div>
    <div class = "times">9:30 a.m.</div>
    <div class = "scheduler_item" id = "Monday_0930" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_0930" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_0930" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_0930" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_0930" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_0930" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_0930" onclick="addItem(this.id)">     </div>
    <div class = "times">10:00 a.m.</div>
    <div class = "scheduler_item" id = "Monday_1000" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1000" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1000" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1000" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1000" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1000" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1000" onclick="addItem(this.id)">     </div>
    <div class = "times">10:30 a.m.</div>
    <div class = "scheduler_item" id = "Monday_1030" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1030" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1030" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1030" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1030" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1030" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1030" onclick="addItem(this.id)">     </div>
    <div class = "times">11:00 a.m.</div>
    <div class = "scheduler_item" id = "Monday_1100" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1100" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1100" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1100" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1100" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1100" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1100" onclick="addItem(this.id)">     </div>
    <div class = "times">11:30 a.m.</div>
    <div class = "scheduler_item" id = "Monday_1130" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1130" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1130" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1130" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1130" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1130" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1130" onclick="addItem(this.id)">     </div>
    <div class = "times">12:00 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1200" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1200" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1200" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1200" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1200" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1200" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1200" onclick="addItem(this.id)">     </div>
    <div class = "times">12:30 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1230" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1230" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1230" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1230" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1230" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1230" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1230" onclick="addItem(this.id)">     </div>
    <div class = "times">1:00 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1300" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1300" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1300" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1300" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1300" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1300" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1300" onclick="addItem(this.id)">     </div>
    <div class = "times">1:30 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1330" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1330" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1330" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1330" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1330" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1330" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1330" onclick="addItem(this.id)">     </div>
    <div class = "times">2:00 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1400" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1400" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1400" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1400" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1400" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1400" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1400" onclick="addItem(this.id)">     </div>
    <div class = "times">2:30 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1430" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1430" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1430" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1430" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1430" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1430" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1430" onclick="addItem(this.id)">     </div>
    <div class = "times">3:00 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1500" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1500" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1500" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1500" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1500" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1500" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1500" onclick="addItem(this.id)">     </div>
    <div class = "times">3:30 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1530" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1530" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1530" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1530" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1530" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1530" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1530" onclick="addItem(this.id)">     </div>
    <div class = "times">4:00 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1600" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1600" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1600" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1600" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1600" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1600" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1600" onclick="addItem(this.id)">     </div>
    <div class = "times">4:30 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1630" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1630" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1630" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1630" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1630" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1630" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1630" onclick="addItem(this.id)">     </div>
    <div class = "times">5:00 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1700" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1700" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1700" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1700" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1700" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1700" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1700" onclick="addItem(this.id)">     </div>
    <div class = "times">5:30 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1730" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1730" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1730" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1730" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1730" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1730" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1730" onclick="addItem(this.id)">     </div>
    <div class = "times">6:00 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1800" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1800" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1800" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1800" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1800" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1800" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1800" onclick="addItem(this.id)">     </div>
    <div class = "times">6:30 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1830" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1830" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1830" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1830" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1830" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1830" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1830" onclick="addItem(this.id)">     </div>
    <div class = "times">7:00 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1900" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1900" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1900" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1900" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1900" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1900" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1900" onclick="addItem(this.id)">     </div>
    <div class = "times">7:30 p.m.</div>
    <div class = "scheduler_item" id = "Monday_1930" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_1930" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_1930" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_1930" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_1930" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_1930" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_1930" onclick="addItem(this.id)">     </div>
    <div class = "times">8:00 p.m.</div>
    <div class = "scheduler_item" id = "Monday_2000" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Tuesday_2000" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Wednesday_2000" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Thursday_2000" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Friday_2000" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Saturday_2000" onclick="addItem(this.id)">     </div>
    <div class = "scheduler_item" id = "Sunday_2000" onclick="addItem(this.id)">     </div>
`;
    document.getElementsByClassName("scheduler")[0].innerHTML = schedule_html;
    for( var day in schedule) {
        if(schedule[day].length != 0) {
            for(var time in schedule[day]) {
                //console.log("splitting day and time", day, schedule_dict[day][time]);
                var id = day + "_" + schedule[day][time];
                console.log(id);
                if(document.getElementById(id).className == "scheduler_item"){
                    document.getElementById(id).className = "scheduler_item_selected";
                }
            }
        }
      }


  }

  function saveSchedule() {
    var sched = getScheduleDays();
    console.log("schedule in save schedule", sched);
  }
