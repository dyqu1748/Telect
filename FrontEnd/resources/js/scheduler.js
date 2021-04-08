function addItem(id) {
    //console.log(id);
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
     return scheduleJSON;
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
                    print("blah");
                    document.getElementById(id).className = "scheduler_item_review_selected";
                }
            }
        }
    }
}