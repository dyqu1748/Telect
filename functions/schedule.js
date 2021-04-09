

const schedule = require('schedulejs');
const later = require('later');

function prepScheduleJSON(schedule) {
    //{"Monday":["1400","1430","1500"],"Tuesday":[],"Wednesday":[],"Thursday":[],"Friday":[],"Saturday":[],"Sunday":[]}

    let dw = "";
    let d;
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

    // make sure it si good JSON, can remove later
    let scheduleJSON = JSON.parse(strJSON);

    return scheduleJSON;

}

function build_avail(dw,t) {
    let a = "";
    let minutes;
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

function size_dict(d){let c=0; for (let i in d) ++c; return c}



function Match (personA, personB, hours) {

    const p = later.parse.text;

    function session(hours, docId1, docId2) {
        return [
            {
                name: 'tutoring session',
                length: hours,                      // lengths specified in hours
                minSchedule: hours,                 // have to schedule all X hours at once
                assignedTo: ['' + docId1 + '', '' + docId2 + ''],    // both personA and personB are needed
                //can only complete during the hours of the scheduling grid
            }
        ];
    }

    function people(personA, personB) {
        return [
            {
                name: personA.id,
                // Student likes to sleep in a bit on the weekends
                availability: prepScheduleJSON(personA.data().availability)
                //availability: 'every weekend after 10:00am and before 6:00pm'
            },
            {
                name: personB.id,
                // Tutor gets up earlier but has plans Saturday afternoon so we note that in her availability
                availability: prepScheduleJSON(personB.data().availability)
                //availability: 'every weekend after 10:00am and before 6:00pm'
            }
        ];
    }

    const task = schedule.tasks()
    .id(function (d) {
        return d.name;
    })
    // our length is in hours, convert to minutes
    .duration(function (d) {
        return d.length * 60;
    })
    .available(function (d) {
         return d.availability;
    })
    // convert minSchedule to minutes
    .minSchedule(function (d) {
        return d.minSchedule ? d.minSchedule * 60 : undefined;
    })
    // resources are the people the tasks have been assigned to
    .resources(function (d) {
        return d.assignedTo;
    });

    const resources = schedule.resources()
          .id(function(d) { return d.name; })
          .available(function(d) { return d.availability; });


    let wi = session(hours,personA.id,personB.id) // Step 1: Define the work items
    console.log("WI: " + JSON.stringify(wi))

    let pe = people(personA,personB) // Step 2: Define the people
    console.log("PEOPLE: " + JSON.stringify(pe))

    let t = task(wi)// Step 3: Format the tasks
    console.log("TASK: " + JSON.stringify(t))

    let r = resources(pe);  // Step 4: Format the resources
    console.log("RESOURCES: " + JSON.stringify(r))

    // Step 5: Set the start date and ime zone
    let currentDate = new Date();
    let cDay = currentDate.getDate()
    let cMonth = currentDate.getMonth() + 1
    let cYear = currentDate.getFullYear()
    const st = new Date(cYear, cMonth, cDay);
    schedule.date.localTime();

    // Step 6: Create the schedule
    const s = schedule.create(t, r, null, st);

    console.log("THE SCHEDULE: " + JSON.stringify(s))

    return s;

}

module.exports = Match;

