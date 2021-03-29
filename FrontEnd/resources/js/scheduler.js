function addItem(id) {
    console.log(id);
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