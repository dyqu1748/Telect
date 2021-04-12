var uuid;
var tutor_num;
var tid;
var response;

firebase.auth().onAuthStateChanged(function(user) {
  if (user != null) {
    uuid = user.uid;
  getMatches();
  } else {
    console.log("No user signed in");
    location.replace("index.html");
  }
});

var subject_keys = {'math':'Math','geometry':'Geometry','pre-algebra':'Pre-Algebra','algebra':'Algebra','science':'Science','geology':'Geology','chemistry':'Chemistry','social_studies':'Social Studies','govtHist': 'U.S. Government and History','language_arts':'Language Arts','spanish': 'Spanish'};


// Get the modal
var scheduleModal = $("#schedule-modal");
var resumeModal = $("#resume-modal");
var moreInfoModal = $("#info-modal");

// Get the <span> element that closes the modal
var span1 = document.getElementById("close-schedule");
var span2 = document.getElementById("close-resume");
var span3 = document.getElementById("close-more-info");

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
  $("#tutor-matches").removeClass("dialogIsOpen");
  $("#match-head").removeClass("dialogIsOpen");
  $("#footer").removeClass("dialogIsOpen");
  $("nav").removeClass("dialogIsOpen");
  scheduleModal.fadeOut('fast');
}

span2.onclick = function() {
  $("#tutor-matches").removeClass("dialogIsOpen");
  $("#match-head").removeClass("dialogIsOpen");
  $("#footer").removeClass("dialogIsOpen");
  $("nav").removeClass("dialogIsOpen");
  resumeModal.fadeOut('fast');
}

span3.onclick = function() {
	$("#tutor-matches").removeClass("dialogIsOpen");
	$("#match-head").removeClass("dialogIsOpen");
	$("#footer").removeClass("dialogIsOpen");
	$("nav").removeClass("dialogIsOpen");
  moreInfoModal.fadeOut('fast');
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target.id == scheduleModal.attr('id')) {
	$("#tutor-matches").removeClass("dialogIsOpen");
	$("#match-head").removeClass("dialogIsOpen");
	$("#footer").removeClass("dialogIsOpen");
	$("nav").removeClass("dialogIsOpen");
    scheduleModal.fadeOut('fast');
  }
  if (event.target.id == resumeModal.attr('id')) {
	$("#tutor-matches").removeClass("dialogIsOpen");
	$("#match-head").removeClass("dialogIsOpen");
	$("#footer").removeClass("dialogIsOpen");
	$("nav").removeClass("dialogIsOpen");
    resumeModal.fadeOut('fast');
  }
  if (event.target.id == moreInfoModal.attr('id')) {
	$("#tutor-matches").toggleClass("dialogIsOpen");
	$("#match-head").toggleClass("dialogIsOpen");
	$("#footer").toggleClass("dialogIsOpen");
	$("nav").toggleClass("dialogIsOpen");
  moreInfoModal.fadeOut('fast')
  }
}

function getMatches() {
    $.ajax({
        url: 'https://us-central1-telect-6026a.cloudfunctions.net/tutorMatches/' + uuid,
        success : function(data) {
            display_matches(data);
            response = data;
        }
    });
  return true;
}

function display_matches(data) {
    var storage = firebase.storage().ref();

    var html = ``;
    var i;
    for(i = 0; i < data.length; i++) {
      var tutorData = data[i];
  		var all_subjects ="";
  		tutorData.subjects.forEach(function(subject,ind){
  			all_subjects+=subject_keys[subject];
                if (ind < tutorData.subjects.length-1){
                  all_subjects+= ', ';
                }
  		});

        html += `
		    <div class="form-group row">
          <div class="card w-75 mx-auto">
            <div class="card-body">
                <h5 class="card-title"> ${tutorData.first_name} ${tutorData.last_name}</h5>
                <div class="row">
                    <div class="col">
                        <img src= ${tutorData.photoUrl} class="tutorPhoto">
                        <br>
						<br>
                        <button onclick="session_details(${i})" class="btn btn-primary rounded-pill">Request Session</button>
						    <button onclick="display_info(${i})" class="btn btn-secondary rounded-pill">More Info</button>
                    </div>
                    <div class="col">
                        <p id="selected_tutor_${i}" style="display: none;">${i}</p>
                        <p class="card-text"> Location: ${tutorData.city + ", "} ${tutorData.state} </p>
                        <p class="card-text"> Desired Hourly Rate: ${"$" + tutorData.minSession}</p>
                        <p class="card-text"> Subjects: ${all_subjects}</p>
                        <p class="card-text"> About Me: ${tutorData.bio} </p>
                        <a href="#" onclick="display_resume(${i})"> Resume </a>
                    </div>
                </div>
            </div>
          </div>
		  </div>
          `;
    }

    $('#tutor-matches').html(html);
  $('#loading_icon').fadeOut("fast");
  $('#page-container').fadeIn();
  return true;
    //          <p id="selected_tutor" style="display: none;">${i}</p>
    //          <button onclick="session_details()">Request Session</button>
    //          </div>
 }

 function display_resume(i) {
    var tutor_num = document.getElementById("selected_tutor_"+i).innerHTML;
  	$("#tutor-matches").addClass("dialogIsOpen");
  	$("#match-head").addClass("dialogIsOpen");
  	$("#footer").addClass("dialogIsOpen");
  	$("nav").addClass("dialogIsOpen");
    resumeModal.fadeIn();
    var resumeContent = `<iframe src=${response[tutor_num].resumeUrl} width="100%" height="500px">`;
    $('#temp-resume').html(resumeContent);
 }

 function display_info(i) {
    moreInfoModal.fadeIn();
	$("#tutor-matches").addClass("dialogIsOpen");
	$("#match-head").addClass("dialogIsOpen");
	$("#footer").addClass("dialogIsOpen");
	$("nav").addClass("dialogIsOpen");
    var tutor_num = document.getElementById("selected_tutor_"+i).innerHTML;
    var tutorData = response[tutor_num];
	console.log(tutorData);
	var all_subjects ="";
		tutorData.subjects.forEach(function(subject,ind){
			all_subjects+=subject_keys[subject];
              if (ind < tutorData.subjects.length-1){
                all_subjects+= ', ';
              }
		});
    var html = `
        <h1 class="display-3"> ${tutorData.first_name} ${tutorData.last_name} </h1>
        <div class = "row">
            <div class="col">
                <img src= ${tutorData.photoUrl} class="tutor-photo-more-info">
                </br>
				</br>
                <button onclick="session_details(${i})" class="btn btn-primary rounded-pill">Request Session</button>
            </div>
            <div class="col">
                <p id="selected_tutor_${i}" style="display: none;">${i}</p>
                <p class="more_info_text"> Location: ${tutorData.city + ", "} ${tutorData.state} </p>
                <p class="more_info_text"> Desired Hourly Rate: ${"$" + tutorData.minSession}</p>
                <p class="more_info_text"> Subjects: ${all_subjects}</p>
                <p class="more_info_text"> About Me: ${tutorData.bio} </p>
                <a class="more_info_text" href="#" onclick="display_resume(${i})"> Resume </a>
                </br>
                <p> insert schedule here </p>
            </div>
        </div>
    `;
    $("#info-placeholder").html(html);
 }

function session_details(i)
{
tutor_num = i;
moreInfoModal.fadeOut('fast');
$('#loading_icon_modal').css("display","block");
$("nav").addClass("dialogIsOpen");
$("#footer").addClass("dialogIsOpen");
$("#match-head").addClass("dialogIsOpen");
$("#tutor-matches").addClass("dialogIsOpen");
var user = firebase.auth().currentUser;
var getTutorMatches = firebase.functions().httpsCallable('tutorMatches');
   getTutorMatches().then((result) => {
       // Read result of the Cloud Function.
       var sanitizedMessage = result.data.text;
       console.log(sanitizedMessage);
     });
   $.ajax({
       url: 'https://us-central1-telect-6026a.cloudfunctions.net/tutorMatches/' + user.uid,
       success : function(data) {
           // console.log(data);
           console.log(user);
           db.collection('users').doc(user.uid).onSnapshot((doc)=> {
        console.log(doc.data());
        var user_info = doc.data();
             var tutor_info = data[tutor_num];
             console.log(tutor_info.schedule);
             var html = `
                 <h1>Request a Session with ${tutor_info.first_name} ${tutor_info.last_name}</h1><br>
                 <h3>Who is this Session For?</h3>
            <div class="form-group row">
            <div class="col">
            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                 `;

          for (var i = 0; i < user_info.children.length; i++) {
          html += `
          <label class="btn btn-outline-primary">
            <input type="radio" id="child" value=${user_info.children[i].child_name} required> ${user_info.children[i].child_name}
          </label>
          `;
        }

          html += `</div>
            </div>
             </div>
                 <h3>Date and Time</h3>
                 <select class="selectpicker form-control" name="sessionTime" id="sessionTime">`

          for (var day in tutor_info.schedule) {
            for (var i = 0; i < tutor_info.schedule[day].length; i++) {
                // make time look better
                printedTime = tutor_info.schedule[day][i].slice(0,2) + ":" + tutor_info.schedule[day][i].slice(2,4);
                html += `<option value=${day}${tutor_info.schedule[day][i]}> ${day} ${printedTime}</option>`;
            }
          }


          html +=  `
            </select>
            <h3>Location Preference</h3>
            <div class="form-group form-inline">
                 `;
             if(user_info.location_pref == "online")
             {
                html += `<div>
                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                  <label class="btn btn-outline-primary active">
                  <input type="radio" id="location-pref" value="online" required> Online
                  </label>
                  <label class="btn btn-outline-primary">
                  <input type="radio" id="location-pref" value="in_person"> In-Person
                  </label>
                </div>
              </div>
               </div>`;

             }else{
                html += `<div>
              <div class="btn-group btn-group-toggle" data-toggle="buttons">
                <label class="btn btn-outline-primary active">
                <input type="radio" id="location-pref" value="online" > Online
                </label>
                <label class="btn btn-outline-primary">
                <input type="radio" id="location-pref" value="in_person" required> In-Person
                </label>
              </div>
              </div>
               </div>`;
             }

             html += `
                 <h3>Price</h3>
                 <p>Your Current Price Range: $${user_info.minSession} - $${user_info.maxSession}</p>
                 <p>Tutor Minimum Session Rate: $${tutor_info.minSession}</p>
                 <div>
                 <h4> Please Input your Desired Session Rate</h4>
            <div class="form-group form-inline">
            <label for="final_price">$</label>
            <div class="col">
            <input type="number" id="final_price" class="form-control" min="${tutor_info.minSession}" value="${user_info.minSession}" placeholder="0.00" required>
             </div>
             </div>
            </div>
                 <h3>Select Subject(s)</h3>
                 <div id="subjectsel">
                 </div>
            <div class="form-group row">
            <div class="col">
            <div class="btn-group-toggle" data-toggle="buttons">
                   `;

        for (var i = 0; i < tutor_info.subjects.length; i++) {
          html += `
           <label class="btn btn-outline-primary">
            <input id="subject" type="checkbox" value=${tutor_info.subjects[i]}> ${subject_keys[tutor_info.subjects[i]]}
          </label>
          `;
        }

        html += `</div>
            </div>
             </div>
            <div class="form-group row">
             <div class="col">
            <button type="submit" class="btn btn-lg btn-primary rounded-pill">Confirm Session</button>
             </div>
             </div>
        `;

             $('#schedule_session').html(html);
        $('#loading_icon_modal').fadeOut("fast");
        scheduleModal.fadeIn();
        document.getElementById("schedule_session").scrollIntoView({behavior: "smooth", block: "center"});
        console.log(document.getElementById("sessionTime").value);
       });
       }
   });
}

 $('#schedule_session').submit(function () {
  checked = $("input[type=checkbox]:checked").length;

   if(!checked) {
     alert("You must check at least one checkbox.");
     return false;
   }else{
   	schedule_session();
  	return false;
 }
 });

function schedule_session()
{

var html = ``;
var user = firebase.auth().currentUser;
var getTutorMatches = firebase.functions().httpsCallable('tutorMatches');
   getTutorMatches().then((result) => {
       // Read result of the Cloud Function.
       var sanitizedMessage = result.data.text;
       console.log(sanitizedMessage);
     });
   $.ajax({
       url: 'https://us-central1-telect-6026a.cloudfunctions.net/tutorMatches/' + user.uid,
       success : function(data) {
           console.log(data);
           db.collection('users').doc(user.uid).onSnapshot((doc)=> {
              console.log(doc.data());
              var user_info = doc.data();
              var tutor_info = data[tutor_num];
              const snapshot = db.collection('users').where("first_name", "==", tutor_info.first_name).where(
                "last_name", "==", tutor_info.last_name).where("phone", "==", tutor_info.phone).get();
              snapshot.then((doc) =>
              {
                doc.forEach(tdoc => {
                  tid = tdoc.id;
                  console.log(tdoc.id);
                  
                  db.collection('sessions').add({
                    user_id : user.uid,
                    tutor_id : tid,
                    requested_session : true,
                    accepted_session : false,
                    completed_session : false,
                    selected_child : document.getElementById("child").value,
                    session_cost : document.getElementById("final_price").value,
                    session_loc : document.getElementById("location-pref").value,
                    session_subject : document.getElementById("subject").value,
                    session_time: document.getElementById("sessionTime").value
                  });

                  // Display the success message
                  var html = `
                        <h1> Session Request Sent </h1>
                  `;
                  $('#schedule_session').html(html);

                  var tutor_num_btn = String("request_btn" + tutor_num);
                  document.getElementById(tutor_num_btn).innerHTML = "Request Pending";
                  document.getElementById(tutor_num_btn).disabled = true;
                })
              })
          });
      }
  });
  return true;
}




