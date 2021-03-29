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
     prepScheduleJSON(schedule)
     return scheduleJSON;
}

function prepScheduleJSON(schedule) {
    //{"Monday":["1400","1430","1500"],"Tuesday":[],"Wednesday":[],"Thursday":[],"Friday":[],"Saturday":[],"Sunday":[]}
    var jsonSchedule ={schedules: [
            {dw: [1], h: []},
            {dw: [2], h: []},
            {dw: [3], h: []},
            {dw: [4], h: []},
            {dw: [5], h: []},
            {dw: [6], h: []},
            {dw: [7], h: []},
        ]};

    var dw1, dw2, dw3, dw4, dw5, dw6, dw7;

    Object.keys(schedule).forEach(function(key) {
        switch (key) {
            case "Monday":
                if (size_dict(schedule[key]) > 0) {
                    dw1 = "{dw: [1], h: []},"
                }
                break;
            case "Tuesday":
                if (size_dict(schedule[key]) > 0) {
                    dw2 = "{dw: [2], h: []},"
                }
                break;
            case "Wednesday":
                if (size_dict(schedule[key]) > 0) {
                    dw3 = "{dw: [3], h: []},"
                }
                break;
            case "Thursday":
                if (size_dict(schedule[key]) > 0) {
                    dw4 = "{dw: [4], h: []},"
                }
                break;
            case "Friday":
                if (size_dict(schedule[key]) > 0) {
                    dw5 = "{dw: [5], h: []},"
                }
                break;
            case "Saturday":
                if (size_dict(schedule[key]) > 0) {
                    dw6 = "{dw: [6], h: []},"
                }
                break;
            case "Sunday":
                if (size_dict(schedule[key]) > 0) {
                    dw7 = "{dw: [7], h: []},"
                }
                break;

        }
    })
    console.log(dw1 + dw2 + dw3 + dw4 + dw5 + dw6 + dw7)

}

function size_dict(d){c=0; for (i in d) ++c; return c}