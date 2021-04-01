
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

    let dw = "";
    let d;
    console.log(schedule)
    Object.keys(schedule).forEach(function(key) {
        switch (key) {
            case "Monday":
                d=1
                break
            case "Tuesday":
                d=2
                break
            case "Wednesday":
                d=3
                break
            case "Thursday":
                d=4
                break
            case "Friday":
                d=5
                break
            case "Saturday":
                d=6
                break
            case "Sunday":
                d=7
                break
        }
        dw = dw + build_avail(d,schedule[key])
    })
    let strJSON = '{"schedules":[' + dw.substring(0, dw.length - 1) + ']}'
    console.log(strJSON)

    let scheduleJSON = JSON.parse(strJSON);
    console.log(scheduleJSON)
}

function build_avail(dw,t)
{
    let a = "";
    if (size_dict(t) > 0) {
        t.forEach((value, index) => {
            if (value.substr(2, 2) != '00') {
                minutes = value.substr(2, 2)
            }
            else { minutes = '0'}
            a = a + '{"dw":[' + dw + '],"h":[' + value.substr(0, 2) + '],"m":[' + minutes + ']},'
        });
    }
    return a
}

function size_dict(d){c=0; for (i in d) ++c; return c}