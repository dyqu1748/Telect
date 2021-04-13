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
                        <button onclick="session_details(${i})" class="btn btn-primary rounded-pill request_btn${i}">Request Session</button>
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
    data.forEach(function(tutorData, ind){
      disableRequest(ind,tutorData);
    });
  $('#loading_icon').fadeOut("fast");
  $('#page-container').fadeIn("slow");
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
                <button onclick="session_details(${i})" class="btn btn-primary btn-lg rounded-pill request_btn${i}">Request Session</button>
            </div>
            <div class="col">
                <p id="selected_tutor_${i}" style="display: none;">${i}</p>
                <p class="more_info_text"> Location: ${tutorData.city + ", "} ${tutorData.state} </p>
                <p class="more_info_text"> Desired Hourly Rate: ${"$" + tutorData.minSession}</p>
                <p class="more_info_text"> Subjects: ${all_subjects}</p>
                <p class="more_info_text"> About Me: ${tutorData.bio} </p>
                <a class="more_info_text" href="#" onclick="display_resume(${i})"> Resume </a>
                </br>
                <br>
                <p class="more_info_text"> Weekly Availability:</p>
                <div class = "scheduler" style="height:5%">
				  <div class = "free_space">     </div>
				  <div class = "days">Monday</div>
				  <div class = "days">Tuesday</div>
				  <div class = "days">Wednesday</div>
				  <div class = "days">Thursday</div>
				  <div class = "days">Friday</div>
				  <div class = "days">Saturday</div>
				  <div class = "days">Sunday</div>
				  <div class = "times">8:00 a.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_0800_review" >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_0800_review" >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_0800_review" >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_0800_review" >     </div>
				  <div class = "scheduler_item_review" id = "Friday_0800_review" >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_0800_review" >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_0800_review"  >     </div>
				  <div class = "times">8:30 a.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_0830_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_0830_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_0830_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_0830_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_0830_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_0830_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_0830_review"  >     </div>
				  <div class = "times">9:00 a.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_0900_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_0900_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_0900_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_0900_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_0900_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_0900_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_0900_review"  >     </div>
				  <div class = "times">9:30 a.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_0930_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_0930_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_0930_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_0930_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_0930_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_0930_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_0930_review"  >     </div>
				  <div class = "times">10:00 a.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1000_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1000_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1000_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1000_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1000_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1000_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1000_review"  >     </div>
				  <div class = "times">10:30 a.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1030_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1030_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1030_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1030_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1030_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1030_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1030_review"  >     </div>
				  <div class = "times">11:00 a.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1100_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1100_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1100_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1100_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1100_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1100_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1100_review"  >     </div>
				  <div class = "times">11:30 a.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1130_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1130_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1130_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1130_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1130_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1130_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1130_review"  >     </div>
				  <div class = "times">12:00 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1200_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1200_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1200_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1200_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1200_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1200_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1200_review"  >     </div>
				  <div class = "times">12:30 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1230_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1230_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1230_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1230_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1230_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1230_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1230_review"  >     </div>
				  <div class = "times">1:00 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1300_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1300_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1300_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1300_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1300_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1300_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1300_review"  >     </div>
				  <div class = "times">1:30 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1330_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1330_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1330_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1330_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1330_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1330_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1330_review"  >     </div>
				  <div class = "times">2:00 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1400_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1400_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1400_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1400_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1400_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1400_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1400_review"  >     </div>
				  <div class = "times">2:30 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1430_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1430_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1430_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1430_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1430_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1430_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1430_review"  >     </div>
				  <div class = "times">3:00 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1500_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1500_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1500_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1500_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1500_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1500_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1500_review"  >     </div>
				  <div class = "times">3:30 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1530_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1530_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1530_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1530_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1530_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1530_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1530_review"  >     </div>
				  <div class = "times">4:00 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1600_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1600_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1600_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1600_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1600_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1600_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1600_review"  >     </div>
				  <div class = "times">4:30 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1630_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1630_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1630_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1630_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1630_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1630_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1630_review"  >     </div>
				  <div class = "times">5:00 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1700_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1700_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1700_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1700_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1700_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1700_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1700_review"  >     </div>
				  <div class = "times">5:30 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1730_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1730_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1730_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1730_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1730_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1730_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1730_review"  >     </div>
				  <div class = "times">6:00 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1800_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1800_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1800_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1800_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1800_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1800_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1800_review"  >     </div>
				  <div class = "times">6:30 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1830_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1830_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1830_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1830_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1830_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1830_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1830_review"  >     </div>
				  <div class = "times">7:00 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1900_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1900_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1900_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1900_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1900_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1900_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1900_review"  >     </div>
				  <div class = "times">7:30 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_1930_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_1930_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_1930_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_1930_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_1930_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_1930_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_1930_review"  >     </div>
				  <div class = "times">8:00 p.m.</div>
				  <div class = "scheduler_item_review" id = "Monday_2000_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Tuesday_2000_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Wednesday_2000_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Thursday_2000_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Friday_2000_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Saturday_2000_review"  >     </div>
				  <div class = "scheduler_item_review" id = "Sunday_2000_review"  >     </div>
	  
			  </div>
            </div>
        </div>
    `;
    $("#info-placeholder").html(html);
    Object.keys(tutorData.schedule).forEach(function(day){
      tutorData.schedule[day].forEach(function(time){
        var curId = day+'_'+time+'_review';
        console.log(curId);
        $('#'+curId).addClass('scheduler_item_selected').removeClass('scheduler_item_review');
      })
      
    });
    document.getElementById("info-placeholder").scrollIntoView({behavior: "smooth"});
    disableRequest(i,tutorData);
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
                 <h3 class="header-control">Who is this Session For?</h3>
            <div class="form-group row">
            <div class="col">
            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                 `;

          for (var i = 0; i < user_info.children.length; i++) {
          html += `
          <label class="btn btn-outline-primary">
            <input type="radio" name="child" value="${user_info.children[i].child_name}" required> ${user_info.children[i].child_name}
          </label>
          `;
        }

          html += `</div>
            </div>
             </div>
                 <h3 class="header-control">Date and Time</h3>
                 <div class="row">
                 <div class="col-md-3">
                 <select class="selectpicker form-control" name="sessionTime" id="sessionTime" data-live-search="true" required>`

          for (var day in tutor_info.schedule) {
            for (var i = 0; i < tutor_info.schedule[day].length; i++) {
                // make time look better
                var time = tutor_info.schedule[day][i];
                if (parseInt(time) >= 1200){
                  if (parseInt(time) >= 1300){
                    time = String(parseInt(time)-1200);
                  }
                  time += " P.M."
                }
                else{
                  if (parseInt(time) < 1000){
                    time = time.substring(1);
                  }
                  time +=  " A.M.";
                }
                time = time.replace(/(?=.{7}$)/,':');

                // printedTime = tutor_info.schedule[day][i].slice(0,2) + ":" + tutor_info.schedule[day][i].slice(2,4);
                html += `<option value=${day}${tutor_info.schedule[day][i]}> ${day} ${time}</option>`;
            }
          }


          html +=  `
            </select>
            </div>
            </div>
            <h3 class="header-control">Location Preference</h3>
            <div class="form-group form-inline">
            <div>
            <div class="btn-group btn-group-toggle" data-toggle="buttons">
              <label class="btn btn-outline-primary active">
              <input type="radio" name="location_pref" value="online" required> Online
              </label>
              <label class="btn btn-outline-primary">
              <input type="radio" name="location_pref" value="in_person"> In-Person
              </label>
            </div>
          </div>
           </div>
                 <h3>Price</h3>
                 <p>Your Current Price Range: $${user_info.minSession} - $${user_info.maxSession}</p>
                 <p>Tutor Minimum Session Rate: $${tutor_info.minSession}</p>
                 <div>
                 <h4 class="header-control"> Please Input your Desired Session Rate</h4>
            <div class="form-group form-inline">
            <label for="final_price">$</label>
            <div class="col">
            <input type="number" id="final_price" class="form-control" min="${tutor_info.minSession}" value="${user_info.minSession}" placeholder="0.00" required>
             </div>
             </div>
            </div>
                 <h3 class="header-control">Select Subject(s)</h3>
                 <div id="subjectsel">
                 </div>
            <div class="form-group row">
            <div class="col">
            <div class="btn-group-toggle" data-toggle="buttons">
                   `;

        for (var i = 0; i < tutor_info.subjects.length; i++) {
          html += `
           <label class="btn btn-outline-primary">
            <input type="checkbox" name="subjects" value=${tutor_info.subjects[i]}> ${subject_keys[tutor_info.subjects[i]]}
          </label>
          `;
        }

        html += `</div>
            </div>
             </div>
            <div class="form-group row">
             <div class="col">
            <button id="confirm_btn" type="submit" class="btn btn-lg btn-primary rounded-pill">Confirm Session</button>
             </div>
             </div>
        `;

             $('#schedule_session').html(html);
             $("#sessionTime").selectpicker('refresh');
             $('input[name="location_pref"][value="'+user_info.location_pref+'"]').click();
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
     alert("Please select at least one subject you would like you session to focus on.");
     return false;
   }else{
   	schedule_session();
  	return false;
 }
 });

function schedule_session()
{
var btnLoad = `<div id="btn-load" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
$('#confirm_btn').html(btnLoad);
var user = firebase.auth().currentUser;
var subjects = [];
$('input[name="subjects"]:checked').each(function() { 
  subjects.push(this.value); 
});
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
                    selected_child : $('input[name="child"]:checked').val(),
                    session_cost : document.getElementById("final_price").value,
                    session_loc : $('input[name="location_pref"]:checked').val(),
                    session_subject : subjects,
                    session_time: document.getElementById("sessionTime").value
                  });

                  // Display the success message
                  var html = `
                        <h1> Session Request Sent </h1>
                  `;
                  $('#schedule_session').html(html);

                  var tutor_num_btn = String("request_btn" + tutor_num);
                  // document.getElementsByClassName(tutor_num_btn).innerHTML = "Request Pending";
                  $('.'+tutor_num_btn).html("Request Pending");
                  $('.'+tutor_num_btn).prop('disabled',true);
                })
              })
          });
      }
  });
  return true;
}


function disableRequest(i,tutorData){
  var userRef = db.collection('users');
    userRef.doc(uuid).get().then((doc)=>{
      var curUserData = doc.data();
      userRef.where("email", "==", tutorData.email)
    .get()
    .then((querySnapshot)=>{
      querySnapshot.forEach((tutorDoc) =>{
        var tutorId = tutorDoc.id;
        db.collection('sessions').where("tutor_id","==",tutorId).where("user_id","==", uuid).where("accepted_session", "==", false)
        .get()
        .then((sessSnap)=>{
          sessSnap.forEach((sess)=>{
            if (sess.exists){
                var tutor_num_btn = String("request_btn" + i);
                //Disable request button; request already made
                $('.'+tutor_num_btn).html("Request Pending");
                  $('.'+tutor_num_btn).prop('disabled',true);
              }
          })
          
        })
      })
    }) 
    }) 
}

