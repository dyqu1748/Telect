
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
    var docId = document.getElementById("docId").value;
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

     //post the schedule as their availability to firebase


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"docid":docId,"grid_json": schedule});
    var requestOptions = {
        mode: 'no-cors',
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("http://localhost:5001/telect-6026a/us-central1/updateAvailability", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
