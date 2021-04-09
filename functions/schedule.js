

const schedule = require('schedulejs');
const later = require('later');

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

    // make sure it si good JSON, can remove later
    let scheduleJSON = JSON.parse(strJSON);
    console.log(scheduleJSON)

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

// To make schedules easier to read, we'll be using the text parser from later,
// if you manually specify the later schedules, you don't need to require it here

p = later.parse.text;


// Step 3: Tasks aren't in the right format, need to create a generator
const t = schedule.tasks()
    .id(function (d) {
        return d.name;
    })
    // our length is in hours, convert to minutes
    .duration(function (d) {
        return d.length * 60;
    })
    // use later.parse.text to parse text into a usable schedule
    .available(function (d) {
        return d.availability ? p(d.availability) : undefined;
    })
    // convert minSchedule to minutes
    .minSchedule(function (d) {
        return d.minSchedule ? d.minSchedule * 60 : undefined;
    })
    // resources are the people the tasks have been assigned to
    .resources(function (d) {
        return d.assignedTo;
    });

const tasks = t(workItems);

// Step 4: Resources aren't in the right format either, need to create a generator
const r = schedule.resources()
    .id(function (d) {
        return d.name;
    })
    .available(function (d) {
        return d.availability ? p(d.availability) : undefined;
    });

const resources = r(people);

// Step 5: Pick a start date for the schedule and set correct timezone
const start = new Date(2021, 3, 11);
schedule.date.localTime();

exports.scheduleTest =  functions.https.onRequest(async (request, response) => {
    response.setHeader('Content-Type', 'application/json')

    // Step 6: Create the schedule
    const s = schedule.create(tasks, resources, null, start);

    response.send({"schedule": s})
});

// BELOW THIS LINE IS A TEST FOR PASSING THE RAW SCHEDULE JSON TO THE SCHEDULER




const json_t = schedule.tasks()
    .id(function (d) {
        return d.name;
    })
    // our length is in hours, convert to minutes
    .duration(function (d) {
        return d.length * 60;
    })
    // use later.parse.text to parse text into a usable schedule
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

const json_tasks = json_t(json_workItems);

export function match (personA, personB, hours) {
    response.setHeader('Content-Type', 'application/json')

    function session(hours, docId1, docId2) {
        return [
            {
                name: hours + 'hours session',
                length: hours,                      // lengths specified in hours
                minSchedule: hours,                 // have to schedule all 2 hours at once
                assignedTo: ['' + docId + '', '' + docId2 + ''],    // both Bob and Sara are needed
                availability: 'after 10:00am and before 9:00pm'
                //can only complete during the hours of the scheduling grid
            }
        ];
    }

    function people(personA, personB) {
        return [
            {
                name: personA.data().docId,
                // Student likes to sleep in a bit on the weekends
                availability: prepScheduleJSON(personA.data().availability)
            },
            {
                name: personB.data().docId,
                // Tutor gets up earlier but has plans Saturday afternoon so we note that in her availability
                availability: prepScheduleJSON(personB.data().availability)
            }
        ];
    }

    // Step 1: Define the work items
    let wi = session(hours,personA.data().docId,personB.data().docId)

    // Step 2: Define the people
    let p = people(personA,personB)
    // Step 3: Format the tasks
    // Step 4: Format the resources
    // Step 5: Set the start date and ime zone
    // Step 6: Create the schedule
    const s = schedule.create(json_tasks, resources, null, start);

    response.send({"schedule": s})
};


