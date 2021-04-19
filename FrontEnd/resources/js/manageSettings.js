// Get current user
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("User found");

	db.collection('users').doc(user.uid).onSnapshot((doc)=> {
		//Display current user's info
		const reveal = async () => {
			const result = await displayProfile(doc.data(),user)
			$('#loading_icon').css('display','none');
			$('#page-container').fadeIn();
		  }
		reveal();
	});
  } else {
	// No user logged in. Redirect to landing page.
    console.log("No user signed in");
	location.replace("index.html");
  }
});

//Dictionaries for use later to present information more nicely
var subject_keys = {'math':'Math','geometry':'Geometry','pre-algebra':'Pre-Algebra','algebra':'Algebra','science':'Science','geology':'Geology','chemistry':'Chemistry','social_studies':'Social Studies','govtHist': 'U.S. Government and History','language_arts':'Language Arts','spanish': 'Spanish'};
var location_keys = {'online':'Online','in_person':'In Person'};
var grade_keys = {'k':'Kindergarten', '1':'1st Grade', '2':'2nd Grade', '3':'3rd Grade', '4':'4th Grade', '5':'5th Grade', '6':'6th Grade', '7':'7th Grade', '8':'8th Grade'}; 

function displayProfile(data,user)
{

	var all_loc ="";
	if (typeof data.location_pref != "string"){
		//For tutor, build location preference string if they have more than one preference
		data.location_pref.forEach(function(locat,ind){
		all_loc+= location_keys[locat]
		if (ind < data.location_pref.length-1){
			all_loc +=', ';
		}
	});
	}
	else{
		//Parent location preference is just a string. Set location to its value.
		all_loc = location_keys[data.location_pref];
	}
	//Build and display user info
	var html =  `<br>  
			<h2><u>User information</u></h2> 
			<br>
				<div class="row">
					<div class ="col-md">
					<h3>Name</h3>
					<p class="lead">${data.first_name} ${data.last_name}</p>
					</div>
					<div class="col-md">
						<h3>Phone Number</h3>
						<p class="lead">${data.phone}</p>
					</div>
			  	</div>
			  <br>
				<h2><u>Location Information</u></h2>
				<br>
			  <div class="row">
			  	<div class="col-md">
					<h3>Address</h3>
					<p class="lead">${data.address}</p>
				</div>
				<div class="col-md">
					<h3>Apartment Info</h3>
					<p class="lead">${data.apartment_info}</p>
				</div> 
			  </div>

			  <div class="row">
			  	<div class="col-md">
					<h3>City</h3>
					<p class="lead">${data.city}</p>
				</div>
				<div class="col-md">
					<h3>State</h3>
					<p class="lead">${data.state}</p>
				</div>
				<div class="col-md">
					<h3>Zip Code</h3>
					<p class="lead">${data.zipCode}</p>
				</div> 
			  </div>

			  <br>
			  <h2><u>Availability Information</u></h2>
				<br>
			  <div class = "scheduler">
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
			<br>
			<h2><u>Session Preferences</u></h2>
			<br>`;
	if (data.user_type == 'parent'){
		//Build and display parent specific info
		var capBGCheck = data.background_check;
		capBGCheck = capBGCheck.charAt(0).toUpperCase() + capBGCheck.slice(1);
		html+= `
		<div class="row">
				<div class ="col-md">
					<h3>Location Preference</h3> 
					<p class="lead">${all_loc}</p>
				</div>
				<div class="col-md">
				<h3>Session Payment Range</h3> 
				<p class="lead">$${data.minSession} to $${data.maxSession}</p>
				</div>
			</div>

		<div class="row">
			<div class="col-md">
				<h3>Prefer Background Checked Tutors</h3> 
				<p class="lead">${capBGCheck}</p>
			</div>
		</div>
		`;
		//Build and display children info (if parent has any)
		if (data.children.length > 0){
			var allChildInfo = `<br><h2><u>Child Information</u></h2><br>`;
            data.children.forEach(function(child,index){
				var all_subjects ="";
				child.subjects.forEach(function(subject,ind){
					all_subjects+= subject_keys[subject];
					if (ind < child.subjects.length - 1){
						all_subjects += ', ';
					}
				})
                allChildInfo += `
                <div class="row">
                <div class="col-md">
                    <h3>Child ${index+1}</h3> 
                </div>
                </div>
                <div class="row">
                <div class="col-md">
                    <h4>Child Name</h4> 
					<p class="lead">${child.child_name}</p>
                </div>
				<div class ="col-md-3">
                    <h4>Grade Level</h4> 
					<p class="lead">${grade_keys[child.grade]}</p>
                </div>
                </div>

                <div class="row">
                <div class ="col-md">
                    <h4>Subjects</h4> 
					<p class="lead">${all_subjects}</p>
                </div>
                </div>

                <div class="row">
                <div class ="col-md">
                    <h4>Selected Avatar</h4> 
					<img src="resources/img/child-${child.avatar}.png" style="width: 150px">
                </div>
                </div>

				</br>`; 
                });
				html+=allChildInfo;
		}
	}
	else{
		var all_grades="";
		//Build a string containing all of the tutor's grade preferences
		data.grade.forEach(function(curGrade,ind){
			all_grades+=grade_keys[curGrade];
              if (ind < data.grade.length-1){
                all_grades+= ', ';
              }
		})
		var all_subjects ="";
		//Build a string containing all of the tutor's subject preferences
		data.subjects.forEach(function(subject,ind){
			all_subjects+=subject_keys[subject];
              if (ind < data.subjects.length-1){
                all_subjects+= ', ';
              }
		})
		//Build and display tutor specific info
		html+= `
		<div class="row">
				<div class ="col-md">
					<h3>Location Preference</h3> 
					<p class="lead">${all_loc}</p>
				</div>
				<div class="col-md">
					<h3>Minimum Session Rate</h3>
					<p class="lead">$${data.minSession}</p>
				</div>
			</div>

		<div class="row">
			<div class="col-md">
				<h3>Grade Levels</h3> 
				<p class="lead">${all_grades}</p>
			</div>
			<div class="col-md">
				<h3>Subjects</h3> 
				<p class="lead">${all_subjects}</p>
			</div>
		</div>

		<div class="row">
			<div class="col-md">
				<h3>Profile Picture</h3> 
				<img src="${user.photoURL}"  width="250px">
			</div>
		</div>

		<div class="row">
			<div class="col-md">
				<h3>About Me</h3> 
				<p class="lead">${data.bio}</p>
			</div>
		</div>

		`;
	}
	//Add account management buttons to bottom of page.
	html += `<div class="form-group row">
	<div class="col-md-2">
	<button class="btn btn-secondary rounded-pill" onclick="onEdit()">Edit Profile</button>
	</div>
	<div class="col-md-2">
        <button class="btn btn-secondary rounded-pill" onclick="editPersonalInfo('email')">Edit Email</button>
        </div>
	<div class="col-md-2">
		<button class="btn btn-secondary rounded-pill" onclick="editPersonalInfo('password')">Edit Password</button>
	</div>
	</div>`;
	$('#display-details').html(html);
	//Fill out scheduler with user's availability.
	Object.keys(data.schedule).forEach(function(day){
		data.schedule[day].forEach(function(time){
			var curId = day+'_'+time+'_review';
			$('#'+curId).addClass('scheduler_item_selected').removeClass('scheduler_item_review');
		})
		
	})

	return true;
}

function onEdit()
{
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    console.log("User found");
	    var user = firebase.auth().currentUser;
		//Get info to fill in fields for editing.
		db.collection('users').doc(user.uid).onSnapshot((doc)=> {
			editProfile(doc.data(), user);
		});
	  } else {
	    console.log("No user signed in");
	  }
	});
}


var child_counter = 0;
function editProfile(data, user)
{
	// Display info in an editable form
	var userInfo =  `
	<br>
	<h2><u>Personal Information</u></h2>
	<br>
	<div class="form-group row">
	<div class="col-md-3">
		<label for="fname" class="control-label">First Name</label>
		<input type ="text" id="fname" class="form-control" value="${data.first_name}" placeholder="First Name" required>
	</div> 
	<div class="col-md-3">
		<label for="lname" class="control-label">Last Name</label>
		<input type ="text" id="lname" class="form-control" value="${data.last_name}" placeholder="Last Name" required>
	</div>
</div>

<div class="form-group row">
	<div class="col-md-6">
		<label for="phone" class="control-label">Phone Number</label>
		<input type="tel" id="phone" class="form-control" placeholder="Phone Number" value="${data.phone}" pattern="[0-9]{10}" required>
		<small id="phoneHelp" class="form-text text-muted">Format: 1234567890</small>
	</div>
</div>

<br>
<h2><u>Location Information</u></h2>
<br>
<div class="form-group row">
	<div class="col-md-6">
		<label for="address" class="control-label">Address</label>
		<input type ="text" id="address" class="form-control" value="${data.address}" placeholder="Address" required>
	</div>
</div>

<div class="form-group row">
	<div class="col-md-3">
		<label for="apartmentInfo">Apartment Info</label>
		<input type = "number" id="apartment_info" class="form-control" value="${data.apartment_info}" placeholder="Apartment #, floor, etc.">
	</div>
	<div class="col-md-3">
		<label for="zipCode" class="control-label">Zip Code</label>
		<input id="zipCode" class="form-control" placeholder="Zip Code" value="${data.zipCode}" pattern="[0-9]{5}" required>
	</div>
</div>

<div class="form-group row">
	<div class="col-md-3">
		<label for="city" class="control-label">City</label>
		<input type ="text" id="city" class="form-control" value="${data.city}" placeholder="City" required>
	</div>
	<div class="col-md-3">
		<label for="state" class="control-label">State</label>
		<select class="selectpicker form-control" id="state" data-live-search="true" title="State" required>
			<option value="AL">Alabama</option>
			<option value="AK">Alaska</option>
			<option value="AZ">Arizona</option>
			<option value="AR">Arkansas</option>
			<option value="CA">California</option>
			<option value="CO">Colorado</option>
			<option value="CT">Connecticut</option>
			<option value="DE">Delaware</option>
			<option value="DC">District Of Columbia</option>
			<option value="FL">Florida</option>
			<option value="GA">Georgia</option>
			<option value="HI">Hawaii</option>
			<option value="ID">Idaho</option>
			<option value="IL">Illinois</option>
			<option value="IN">Indiana</option>
			<option value="IA">Iowa</option>
			<option value="KS">Kansas</option>
			<option value="KY">Kentucky</option>
			<option value="LA">Louisiana</option>
			<option value="ME">Maine</option>
			<option value="MD">Maryland</option>
			<option value="MA">Massachusetts</option>
			<option value="MI">Michigan</option>
			<option value="MN">Minnesota</option>
			<option value="MS">Mississippi</option>
			<option value="MO">Missouri</option>
			<option value="MT">Montana</option>
			<option value="NE">Nebraska</option>
			<option value="NV">Nevada</option>
			<option value="NH">New Hampshire</option>
			<option value="NJ">New Jersey</option>
			<option value="NM">New Mexico</option>
			<option value="NY">New York</option>
			<option value="NC">North Carolina</option>
			<option value="ND">North Dakota</option>
			<option value="OH">Ohio</option>
			<option value="OK">Oklahoma</option>
			<option value="OR">Oregon</option>
			<option value="PA">Pennsylvania</option>
			<option value="RI">Rhode Island</option>
			<option value="SC">South Carolina</option>
			<option value="SD">South Dakota</option>
			<option value="TN">Tennessee</option>
			<option value="TX">Texas</option>
			<option value="UT">Utah</option>
			<option value="VT">Vermont</option>
			<option value="VA">Virginia</option>
			<option value="WA">Washington</option>
			<option value="WV">West Virginia</option>
			<option value="WI">Wisconsin</option>
			<option value="WY">Wyoming</option>
		</select>
	</div>
</div>
<br>
<h2><u>Session Preferences</u></h2>
<br>
<h4>Update Your Availability</h4>
<p class="lead" style="font-size:1rem">Note: Updating your availability will not affect existing scheduled sessions.</p>

<div class = "scheduler" id="scheduler">
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
    
            </div>
			<br>
				  `;
	//Build user specific fields and fill them with the user's info
	if (data.user_type == "parent"){
		userInfo+= `

		<h4>Minimum Session Rate</h4>
                <div class="form-group form-inline">
                    <label for="minSession">$</label>
                    <div class="col-md-3">
                        <input type="number" id="minSession" class="form-control" min="0.00"  step="0.01" placeholder="0.00" value="${data.minSession}" required>
                    </div>
                </div>

                <h4>Maximum Session Rate</h4>
                <div class="form-group form-inline">
                    <label for="maxSession">$</label>
                    <div class="col-md-3">
                        <input type="number" id="maxSession" class="form-control" step="0.01" placeholder="0.00" value="${data.maxSession}" title="Max session rate must be greater than or equal to your min session rate." required>
                    </div>
                </div>

                <h4>Session Location Preference</h4>
                <div class="form-group form-inline">
                    <div class="btn-group btn-group-toggle" data-toggle="buttons">
                        <label class="btn btn-outline-primary active">
                        <input type="radio" name="location_pref" value="online" required> Online
                        </label>
                        <label class="btn btn-outline-primary">
                        <input type="radio" name="location_pref" value="in_person"> In-Person
                        </label>
                    </div>
                </div>

                <h4>Would you like your tutors to be background checked?</h4>
                <div class="form-group form-inline">
                    <div class="btn-group btn-group-toggle" data-toggle="buttons">
                        <label class="btn btn-outline-primary active">
                        <input type="radio" name="background_check" value="yes" required> Yes
                        </label>
                        <label class="btn btn-outline-primary">
                        <input type="radio" name="background_check" value="no" > No
                        </label>
                    </div>
                </div>`;
		$('#display-details').html(userInfo);
		$('#state').val(data.state);
		$('input[name="location_pref"][value="'+data.location_pref+'"]').click();
		$('input[name="background_check"][value="'+data.background_check+'"]').click();

		//Build and fill out child forms if user has any children
		if (data.children.length > 0){
			data.children.forEach(function(child){
				if (child_counter == 0){
					child_counter++;
					var childInfo=`
					<br>
					<h2 id="child-info-head"><u>Children Information</u></h2>
					<div id="child-form1"><br>
					<h3 id="child-form-header">Child 1</h3>
					<h4>Add your child's full name (optional)</h4>
							<div class="form-group row">
								<div class="col-md-4">
									<input type ="text" id="childName" class="form-control" placeholder="Child's Full Name">
								</div>
							</div>
					<h4>Add your child's current grade level</h4>
				
					<div class="form-group row">
					<div class="col-md-3">
					<select class="selectpicker" id="grade" title="Select Grade Level" required>
						<option value="k">Kindergarten</option>
						<option value="1">1st Grade</option>
						<option value="2">2nd Grade</option>
						<option value="3">3rd Grade</option>
						<option value="4">4th Grade</option>
						<option value="5">5th Grade</option>
						<option value="6">6th Grade</option>
						<option value="7">7th Grade</option>
						<option value="8">8th Grade</option>
					</select>
					</div>
					</div>
				
					<h4>Select the subjects your child needs help with</h4>
				
					<div class="form-group row">
						<div class="col-md-3">
							<select class="selectpicker" id ='subjects' data-live-search="true" multiple title="Select Subjects" required>
								<option value="math">Math</option>
								<option value="geometry">Geometry</option>
								<option value="pre-algebra">Pre-algebra</option>
								<option value="algebra">Algebra</option>
								<option value="science">Science</option>
								<option value="geology">Geology</option>
								<option value="chemistry">Chemistry</option>
								<option value="social_studies">Social Studies</option>
								<option value="govtHist">U.S. Government and History</option>
								<option value="language_arts">Language Arts</option>
								<option value="spanish">Spanish</option>
							</select>
						</div>
					</div>
					<h4>Choose an avatar for your child</h4>
					<div class="form-group row">
						<div class="col">
						<select id="avatar" class="image-picker show-html" required>
								<option data-img-src="resources/img/child-avatar1.png" value="avatar1">Avatar 1</option>
								<option data-img-src="resources/img/child-avatar2.png" value="avatar2">Avatar 2</option>
								<option data-img-src="resources/img/child-avatar3.png" value="avatar3">Avatar 3</option>
								<option data-img-src="resources/img/child-avatar4.png" value="avatar4">Avatar 4</option>
						</select>
					</div>
					</div>
					</div>
					<div id="child-placeholder"></div>`;
					$('#display-details').append(childInfo);
					//Fill in child information with what's present in database
					$('#childName').val(child.child_name);
					$('#subjects').val(child.subjects);
					$('#avatar').val(child.avatar);
					$('#grade').val(child.grade);
				}
				else{
					//Clone first child fields, change id's to new child's id
					addChildForm();
					//Fill in child information with what's present in database
					$('#childName'+child_counter).val(child.child_name);
					$('#grade'+child_counter).val(child.grade);
					$('#subjects'+child_counter).val(child.subjects);
					$('#avatar'+child_counter).val(child.avatar);
				}
			});
		}
		//Display add and remove child buttons if the user already has children
		if (child_counter > 0){
			var addChildButtons = `
		<div class="form-group row">
			<div class="col-md-3">
				<button type="button" id="add-child" class="btn btn-secondary rounded-pill d-none" onclick="showAddChild()">Add Child</button>
			</div>
		</div>
		<div class="form-group row">
			<div class="col col-md-2">
				<button type="button" class="btn btn-secondary rounded-pill" id="addChildButton" onclick="addChildForm()">Add Child</button>
			</div>
			<div class="col col-md-2">
				<button type="button" class="btn btn-secondary rounded-pill" id="remChildButton" onclick="delChildForm()">Remove Child</button>
			</div>
		</div>
		`;
		}
		//Only display add child button if user has no children.
		else{
			var addChildButtons = `
			<br>
			<h2 id="child-info-head" class="d-none"><u>Children Information</u></h2>
			<div id="child-form1"></div>
			<div id="child-placeholder"></div>

			<div class="form-group row">
				<div class="col-md-3">
					<button type="button" id="add-child" class="btn btn-secondary rounded-pill" onclick="showAddChild()">Add Child</button>
				</div>
			</div>
		
		

		<div class="form-group row">
			<div class="col col-md-2">
				<button type="button" class="btn btn-secondary rounded-pill d-none" id="addChildButton" onclick="addChildForm()">Add Child</button>
			</div>
			<div class="col col-md-2">
				<button type="button" class="btn btn-secondary rounded-pill d-none" id="remChildButton" onclick="delChildForm()">Remove Child</button>
			</div>
		</div>
		`;
		}
		$('#display-details').append(addChildButtons);
	}
	else{
		//Build and display tutor fields
		userInfo+=`
		<h3>Enter the minimum pay rate you would like to receive for a session</h3>
                <div class="form-group form-inline">
                    <label for="minSession">$</label>
                    <div class="col-md-3">
                        <input type="number" id="minSession" min="0.00" class="form-control" step="0.01" placeholder="0.00" required>
                    </div>
                </div>

                <h3>List the subjects you are interested in</h3>
                <div class="form-group row">
                    <div class="col-md-3">
                        <select class="selectpicker" id ='subjects' data-live-search="true" multiple title="Select Subjects" required>
                        <option value="math">Math</option>
                        <option value="geometry">Geometry</option>
                        <option value="pre-algebra">Pre-algebra</option>
                        <option value="algebra">Algebra</option>
                        <option value="science">Science</option>
                        <option value="geology">Geology</option>
                        <option value="chemistry">Chemistry</option>
                        <option value="social_studies">Social Studies</option>
                        <option value="govtHist">U.S. Government and History</option>
                        <option value="language_arts">Language Arts</option>
                        <option value="spanish">Spanish</option>
                    </select>
                    </div>
                </div>
                
                <h3>Which grade levels are you interested in working with? (Select all that apply)</h3>
                <div class="form-group form-inline">
                    <div class="btn-group btn-group-toggle" data-toggle="buttons">
                        <label class="btn btn-outline-primary">
                        <input type="checkbox" name="grades" id="grades_k" value="k"/> K
                        </label>
                        <label class="btn btn-outline-primary">
                        <input type="checkbox" name="grades" id="grades_1" value="1"/> 1
                        </label>
                        <label class="btn btn-outline-primary">
                        <input type="checkbox" name="grades" id="grades_2" value="2"/> 2
                        </label>
                        <label class="btn btn-outline-primary">
                            <input type="checkbox" name="grades" id="grades_3" value="3"/> 3
                        </label>
                        <label class="btn btn-outline-primary">
                            <input type="checkbox" name="grades" id="grades_4" value="4"/> 4
                        </label>
                        <label class="btn btn-outline-primary">
                            <input type="checkbox" name="grades" id="grades_5" value="5"/> 5
                        </label>
                        <label class="btn btn-outline-primary">
                            <input type="checkbox" name="grades" id="grades_6" value="6"/> 6
                        </label>
                        <label class="btn btn-outline-primary">
                            <input type="checkbox" name="grades" id="grades_7" value="7"/> 7
                        </label>
                        <label class="btn btn-outline-primary">
                            <input type="checkbox" name="grades" id="grades_8" value="8"/> 8
                        </label>
                    </div>          
                </div>

                <h3>Are you comfortable with doing in-person sessions along with online sessions?</h3>
                    <div class="form-group form-inline">
                        <div class="btn-group btn-group-toggle" data-toggle="buttons">
                            <label class="btn btn-outline-primary active">
                            <input type="radio" name="in_person_sessions" id="location_pref_both" value="yes" required> Yes
                            </label>
                            <label class="btn btn-outline-primary">
                            <input type="radio" name="in_person_sessions" id="location_pref_online" value="no"> No
                            </label>
                        </div>
                    </div>

				<h3>Update Resume</h3>
				<div class="form-group row">
					<div class="col-auto">
						<input type="file" id="resume" accept=".pdf,.doc"/>  
					</div>
				</div>

				<h3>Update Profile Picture</h3>
				<div class="form-group row">
					<div class="col-auto">
						<input type="file" id="photo" accept="image/*"/>  
					</div>
				</div>

                <h3>About You</h3>
                <div class="form-group">
                        <textarea id="bio" rows="5", cols="100" required></textarea>   
                </div>
		`;
		$('#display-details').html(userInfo);
		//Fill in tutor fields with their info
		for (let id in data){
			if(id == 'location_pref'){
				//Select locations specified in user's info
				if (data[id].length > 1 ){
					$('#'+id+"_both").click();
				}
				else{
					$('#'+id+"_online").click();
				}
			}
			else if (id == "grade"){
				//Select grades specified in user's info
				data[id].forEach(function(grade){
					$('#grades_'+grade).click();
				})
			}
			else{
				//Fill in text fields as is
				$('#'+id).val(data[id]);
			}
		}
	}
	//Add submit button to end of form.
	var subButton = `<div class="form-group row">
	<div class="col-lg-3">
	<button type="submit" class="btn btn-lg btn-primary rounded-pill" form="display-details">Update Profile</button>
	</div>
	</div>`;
	$('#display-details').append(subButton);
	//Refresh imagepicker and selectpicker fields for proper display
	$(".image-picker").imagepicker('refresh');
	$(".selectpicker").selectpicker("refresh");
	//Listen for changes in min session field. Adjust min of maximum session field to match min session field value.
	$('#minSession').change(function(){
		var newMin = parseFloat($('#minSession').val());
		$('#maxSession').attr('min', newMin);
	  });
	  $('#maxSession').tooltip({
		placement: "right",
		trigger: "focus"
   });
   //Fill out scheduler with days already selected in user's info.
   Object.keys(data.schedule).forEach(function(day){
	data.schedule[day].forEach(function(time){
		var curId = day+'_'+time;
		$('#'+curId).click();
	})
	
})
   return;
}


function updateaccount()
{
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    console.log("User found");
	    var user = firebase.auth().currentUser;
		var updateUser = db.collection('users').doc(user.uid);
		//Grab field values from the page
	    var fname = document.getElementById("fname").value;
		var lname = document.getElementById("lname").value;
		var phone = document.getElementById("phone").value;
		var address = document.getElementById("address").value;
		var apartment_info = document.getElementById("apartment_info").value;
		var city = document.getElementById("city").value;
		var state = document.getElementById("state").value;
		var zipCode = document.getElementById("zipCode").value;
		var min_session = document.getElementById("minSession").value;
		var schedule = getScheduleDays()[1];
        //Check if the user has selected at least one slot for their schedule
		if (checkScheduleReq(schedule) == false){
			//User has not selected a slot. Scroll up to scheduler, inform user to select a slot.
			$([document.documentElement, document.body]).animate({
			  scrollTop: $("#scheduler").offset().top-150
		  }, 1000);
		  window.alert("Please choose at least one slot for you availability.");  
			return false;
		  }
		//Fade out page and display loader while information is being updated.
		$('#loading_icon').fadeIn();
  		$('#page-container').css('filter', 'blur(1.5rem)');
		$('#footer').css('filter', 'blur(1.5rem)');
		//Check account type by fields present on page
		if ($('#maxSession').length > 0){
			//Parent account. Get account specific info and update account info.
			var max_session = document.getElementById("maxSession").value;
			var location_pref = $('input[name="location_pref"]:checked').val();
			var background_check = $('input[name="background_check"]:checked').val();
			// compose child array
			var childData = []
			for (var i=1; i <= child_counter; i++) {
				if (i == 1) {
				var childName = document.getElementById("childName").value;
				var grade = document.getElementById("grade").value;
				var subjects = $('#subjects').val()
				var avatar = document.getElementById("avatar").value;
				} else {
				var childName = document.getElementById("childName" + i).value;
				var grade = document.getElementById("grade" + i).value;
				var subjects = $('#subjects' + i).val()
				var avatar = document.getElementById("avatar" + i).value;
				}

			childItem = {
				"child_name": childName,
				"grade": grade,
				"subjects": subjects,
				"avatar": avatar
			}
			childData.push(childItem)
			}
			//Write new info to database
			return updateUser.update({
			"first_name": fname,
			"last_name": lname,
			"phone": phone,
			"address": address,
			"apartment_info": apartment_info,
			"city": city,
			"state": state,
			"zipCode": zipCode,
			"schedule":schedule,
			"minSession": min_session,
			"maxSession": max_session,
			"location_pref": location_pref,
			"background_check": background_check,
			"children":childData
			})
			.then(()=>{
				return updateUser.get().then((doc) => {
					if (doc.exists) {
						//Display updated info to page.
						displayProfile(doc.data(),user);
						child_counter = 0;
						$('#loading_icon').css('display','none');
						$('#page-container').css('filter', 'blur(0px)');
						$('#footer').css('filter', 'blur(0px)');
					} else {
						// doc.data() will be undefined in this case
						console.log("No such document!");
					}
				}).catch((error) => {
					console.log("Error getting document:", error);
				});
			});
		}
		else{
			//Tutor account. Get account specific info and update account info.
			if ($('input[name="in_person_sessions"]:checked').val() == "yes"){
				var location_pref = ["in_person","online"];
			}
			else{
				var location_pref = ["online"];
			}
			var grades = [];
			//Build grades array for storage in database
			$('input[name="grades"]:checked').each(function() { 
				grades.push(this.value); 
			});
			var subjects = $('#subjects').val()
			var bio = $("#bio").val();

			//Write new info to user document in database
			return updateUser.update({
				"first_name": fname,
				"last_name": lname,
				"phone": phone,
				"address": address,
				"apartment_info": apartment_info,
				"city": city,
				"state": state,
				"zipCode": zipCode,
				"schedule":schedule,
				"minSession": min_session,
				"location_pref": location_pref,
				"grade":grades,
				"subjects":subjects,
				"bio": bio
				})
			.then(()=>{
				var resumeFile = $('#resume').prop('files')[0];
				var profilePic = $('#photo').prop('files')[0];
				//Check to see if new resume/profile picture was submitted
				if (resumeFile != undefined || profilePic != undefined){
					if (resumeFile != undefined){
						//Resume file exists; upload resume
						return uploadResume(resumeFile, user).then(()=>{
							if (profilePic != undefined){
								//Profile picture file exists; upload picture
								return uploadPhoto(profilePic, user);
							}
						});
					}
					else{
						//Upload only profile picture
						return uploadPhoto(profilePic, user);
					}
				}
			})
			.then(()=>{
				return updateUser.get().then((doc) => {
					if (doc.exists) {
						//Display updated info to page.
						displayProfile(doc.data(),user);
						$('#loading_icon').css('display','none');
						$('#page-container').css('filter', 'blur(0px)');
						$('#footer').css('filter', 'blur(0px)');
					} else {
						// doc.data() will be undefined in this case
						console.log("No such document!");
					}
				}).catch((error) => {
					console.log("Error getting document:", error);
				});
			})
		}
	  } else {
	    console.log("No user signed in");
	  }
	});
	return false;
	
}

function uploadPhoto(profilePic, user){
	var storageRef = firebase.storage().ref();
	//Rename the file to the user's uid.
	var picName = 'profilePictures/'+user.uid+'.'+profilePic.name.split('.').pop(); 
	var picRef = storageRef.child(picName);
	const userCollectionRef = db.collection('users').doc(user.uid);
	//Upload file to Firebase
	return picRef.put(profilePic,profilePic.type).then((snapshot) =>{
		console.log("Uploaded profile pic!");
	}).then(()=>{
		var store = firebase.storage();
		return store.ref(picName).getDownloadURL().then((url)=>{
			return user.updateProfile({photoURL: url});
		});
	})
	.then(() =>{
		//Save file url to user's database document as well for display later
        return storageRef.child(picName).getDownloadURL().then((url) =>{
            return userCollectionRef.update({"photoUrl": url})});
    });
}

function uploadResume(resumeFile, user){
	//Rename the file to the user's uid.
	var storageRef = firebase.storage().ref();
	var resumeName = 'resumes/'+user.uid+'.'+resumeFile.name.split('.').pop();
	var resumeRef = storageRef.child(resumeName);
	const userCollectionRef = db.collection('users').doc(user.uid);
	//Upload file to Firebase
	return resumeRef.put(resumeFile,resumeFile.type).then((snapshot) =>{
		console.log("Uploaded resume!");
	}).then(() => {
		//Save file url to user's database document as well for display later
        return storageRef.child(resumeName).getDownloadURL().then((url) => {
            return userCollectionRef.update({"resumeUrl": url})});
      });
}

function editPersonalInfo(infoType){
	if (infoType == "email"){
		//Build and display edit email fields
		var html = `
		<div class="row">
		<div class="col">
		<form id="personal-changes" onsubmit="return updateEmail()">
		<br>  
			<h2>Edit Email</h2> 
			<br>
			<div class="form-group row">
				<div class="col-md-3">
					<label for="email" class="control-label">New Email Address</label>
					<input type ="email" id="email" class="form-control" placeholder="Email" required>
				</div> 
			</div>
			<div class="form-group row">
				<div class="col-md-3">
					<label for="password" class="control-label">Password</label>
					<input type ="password" id="password" class="form-control" placeholder="Password" required>
				</div> 
			</div>
			<div class="form-group row">
			<div class="col-md-2">
			<button type="submit" class="btn btn-primary rounded-pill" form="personal-changes" value="Submit">Change Email</button>
			</div>
			<div class="col-md-2">
				<button class="btn btn-secondary rounded-pill" onclick="editGeneralInfo()">Edit General Info</button>
			</div>
			</div>
			</form>
			</div>
			
		</div>
			`;
	}
	else{
		//Build and display edit password fields
		var html = `
		<div class="row">
		<div class="col">
		<form id="personal-changes" onsubmit="return updatePassword()" oninput='verPass.setCustomValidity(verPass.value != newPass.value ? "Passwords do not match." : "")'>
		<br>  
			<h2>Edit Password</h2> 
			<br>
			<div class="form-group row">
				<div class="col-md-3">
					<label for="email" class="control-label">Current Password</label>
					<input type ="password" id="curPassword" class="form-control" placeholder="Current Password" required>
				</div> 
			</div>
			<div class="form-group row">
				<div class="col-md-3">
					<label for="newPassword" class="control-label">New Password</label>
					<input type ="password" id="newPassword" class="form-control" name="newPass" placeholder="New Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Your password must contain at least one uppercase, one lowercase letter, and one number" required>
				</div> 
			</div>
			<div class="form-group row">
				<div class="col-md-3">
					<label for="repNewPassword" class="control-label">Repeat New Password</label>
					<input type ="password" id="repNewPassword" class="form-control" name="verPass" placeholder="Repeat New Password" required>
				</div> 
			</div>
			<div class="form-group row">
				<div class="col-md-3">
				<button type="submit" class="btn btn-primary rounded-pill">Change Password</button>
				</div>
				<div class="col-md-3">
				<button class="btn btn-secondary rounded-pill" onclick="editGeneralInfo()">Edit General Info</button>
			</div>
			</div>
			</form>
			</div>
			
		</div>
		`;
	}
	//Fade in personal info fields to page
	$('#personal-info').html(html);
	$('#general-info').fadeOut("fast");
	$('#personal-info').fadeIn();
}

function updateEmail(){
	//Blur page and show loading icon while info is being updated
	$('#loading_icon').fadeIn();
	$('#page-container').css('filter', 'blur(1.5rem)');
	$('#footer').css('filter', 'blur(1.5rem)');
	var user = firebase.auth().currentUser;
	var password = $('#password').val();
	var credential = firebase.auth.EmailAuthProvider.credential(
		user.email,
		password 
	);
	user.reauthenticateWithCredential(credential).then(() => {
	// User re-authenticated.
	console.log("Reverified");
	var newEmail = $('#email').val();
	user.updateEmail(newEmail).then(() => {
		// Update successful. Display success message to user.
		console.log("Email Updated");
		var suc = `<div class="alert alert-success alert-dismissible">
		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		<strong>Success!</strong> Your email has been changed.
	  </div>`
		$('#personal-info').prepend(suc);
		$('#loading_icon').css('display','none');
		$('#page-container').css('filter', 'blur(0px)');
	  }).catch(()=>{
		// An error happened. Display error message to user.
		console.log("Failed to update email");
		var fail = `<div class="alert alert-danger alert-dismissible">
		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		<strong>Oh no!</strong> We were unable to change your email.
	  </div>`
		$('#personal-info').prepend(fail);
		$('#loading_icon').css('display','none');
		$('#page-container').css('filter', 'blur(0px)');
		$('#footer').css('filter', 'blur(0px)');
	  });
	}).catch(() => {
	// An error happened. Display error message to user.
	console.log("Invalid Credentials");
	var fail = `<div class="alert alert-danger alert-dismissible">
		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		<strong>Oh no!</strong> The current password you entered is incorrect.
	  </div>`
		$('#personal-info').prepend(fail);
		$('#loading_icon').css('display','none');
		$('#page-container').css('filter', 'blur(0px)');
		$('#footer').css('filter', 'blur(0px)');
	});
	return false;
}

function updatePassword(){
	//Blur page and show loading icon while info is being updated
	$('#loading_icon').fadeIn();
	$('#page-container').css('filter', 'blur(1.5rem)');
	$('#footer').css('filter', 'blur(1.5rem)');
	var user = firebase.auth().currentUser;
	var curPassword = $('#curPassword').val();
	var credential = firebase.auth.EmailAuthProvider.credential(
		user.email,
		curPassword
	);
	user.reauthenticateWithCredential(credential).then(() => {
	// User re-authenticated.
	console.log("Reverified");
	var newPassword = $('#newPassword').val();
	user.updatePassword(newPassword).then(() => {
		// Update successful. Display success message to user.
		console.log("Password Updated");
		var suc = `<div class="alert alert-success alert-dismissible">
		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		<strong>Success!</strong> Your password has been changed.
	  </div>`
		$('#personal-info').prepend(suc);
		$('#loading_icon').css('display','none');
		$('#page-container').css('filter', 'blur(0px)');
	  }).catch(() => {
		// An error happened. Display error message to user.
		confirm.log("Failed to update password");
		var fail = `<div class="alert alert-danger alert-dismissible">
		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		<strong>Oh no!</strong> We were unable to change your password.
	  </div>`
		$('#personal-info').prepend(fail);
		$('#loading_icon').css('display','none');
		$('#page-container').css('filter', 'blur(0px)');
	  });
	}).catch(() => {
	// An error happened. Display error message to user.
	console.log("Invalid Credentials");
	var fail = `<div class="alert alert-danger alert-dismissible">
		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		<strong>Oh no!</strong> The current password you entered is incorrect.
	  </div>`
		$('#personal-info').prepend(fail);
		$('#loading_icon').css('display','none');
		$('#page-container').css('filter', 'blur(0px)');
	});
	return false;
}

function editGeneralInfo(){
	//Fade out personal info fields, fade in general info area.
	$("#personal-info").fadeOut();
	$("#general-info").fadeIn();
	$("#personal-info").empty();
}