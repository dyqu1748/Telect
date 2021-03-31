// Get current user
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("User found");
	user.providerData.forEach(function (profile) {
		console.log("Sign-in provider: " + profile.providerId);
		console.log("  Provider-specific UID: " + profile.uid);
		console.log("  Name: " + profile.displayName);
		console.log("  Email: " + profile.email);
		console.log("  Photo URL: " + profile.photoURL);
	  });

	db.collection('users').doc(user.uid).onSnapshot((doc)=> {
		console.log(doc.data());
		const reveal = async () => {
			const result = await displayProfile(doc.data(),user)
			$('#loading_icon').css('display','none');
			$('#page-container').fadeIn();
		  }
		reveal();
	});
  } else {
    console.log("No user signed in");
	location.replace("index.html");
  }
});

var subject_keys = {'math':'Math','geometry':'Geometry','pre-algebra':'Pre-Algebra','algebra':'Algebra','science':'Science','geology':'Geology','chemistry':'Chemistry','social_studies':'Social Studies','govtHist': 'U.S. Government and History','language_arts':'Language Arts','spanish': 'Spanish'};
var location_keys = {'online':'Online','in_person':'In Person'};
var grade_keys = {'k':'Kindergarten', '1':'1st Grade', '2':'2nd Grade', '3':'3rd Grade', '4':'4th Grade', '5':'5th Grade', '6':'6th Grade', '7':'7th Grade', '8':'8th Grade'}; 

function displayProfile(data,user)
{
	// Account Info
	for (let key in data){
		console.log(key);
	}
	var all_loc ="";
	if (typeof data.location_pref != "string"){
		data.location_pref.forEach(function(locat,ind){
		all_loc+= location_keys[locat]
		if (ind < data.location_pref.length-1){
			all_loc +=', ';
		}
	});
	}
	else{
		all_loc = location_keys[data.location_pref];
	}
	
	var html =  `<br>  
			<h2><u>User information</u></h2> 
			<br>
				<div class="row">
					<div class ="col-md-3">
						<h3>Name</h3>
					</div>
					<div class="col-md-3">
						<h3>Phone Number</h3>
					</div>
			  	</div>
				<div class ="row">
					<div class="col-md-3">
						<p class="lead">${data.first_name} ${data.last_name}</p>
					</div>
					<div class="col-md-3">
						<p class="lead">${data.phone}</p>
					</div> 
				</div>
			  <br>
				<h2><u>Location Information</u></h2>
				<br>
			  <div class="row">
			  	<div class="col-md-3">
					<h3>Address</h3>
				</div>
				<div class="col-md-3">
					<h3>Apartment Info</h3>
				</div> 
			  </div>
			  <div class="row">
			  	<div class="col-md-3">
				  <p class="lead">${data.address}</p>
				</div>
			 	<div class="col-md-3">
					<p class="lead">${data.apartment_info}</p>
				 </div> 
			  </div>
			  <div class="row">
			  	<div class="col-md-3">
					<h3>City</h3>
				</div>
				<div class="col-md-3">
					<h3>State</h3>
				</div>
				<div class="col-md-3">
					<h3>Zip Code</h3>
				</div> 
			  </div>
			  <div class="row">
			  	<div class="col-md-3">
				  <p class="lead">${data.city}</p>
				</div>
			 	<div class="col-md-3">
					<p class="lead">${data.state}</p>
				 </div>
				 <div class="col-md-3">
					<p class="lead">${data.zipCode}</p>
				 </div>  
			  </div>
			  <br>
			<h2><u>Session Preferences</u></h2>
			<br>`;
	if (data.user_type == 'parent'){
		var capBGCheck = data.background_check;
		capBGCheck = capBGCheck.charAt(0).toUpperCase() + capBGCheck.slice(1);
		html+= `
		<div class="row">
				<div class ="col-md-3">
					<h3>Location Preference</h3> 
				</div>
				<div class="col-md-4">
				<h3>Session Payment Range</h3> 
				</div>
			</div>
			<div class="row">
				<div class="col-md-3">
					<p class="lead">${all_loc}</p>
				</div> 
				<div class="col-md-4">
				<p class="lead">$${data.minSession} to $${data.maxSession}</p>
			</div> 
			</div>
		<div class="row">
			<div class="col-md-3">
				<h3>Prefer Background Checked Tutors</h3> 
			</div>
		</div>
		<div class="row">
			<div class="col-md-3">
				<p class="lead">${capBGCheck}</p>
			</div> 
		</div>
		`;
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
                <div class="col-md-3">
                    <h3>Child ${index+1}</h3> 
                </div>
                </div>
                <div class="row">
                <div class="col-md-3">
                    <h4>Child Name</h4> 
                </div>
				<div class ="col-md-3">
                    <h4>Grade Level</h4> 
                </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <p class="lead">${child.child_name}</p>
                    </div>
					<div class="col">
                        <p class="lead">${grade_keys[child.grade]}</p>
                </div> 
                </div>
                <div class="row">
                <div class ="col-md-3">
                    <h4>Subjects</h4> 
                </div>
                </div>
                <div class="row">
                    <div class="col">
                        <p class="lead">${all_subjects}</p>
                </div> 
                </div>
                <div class="row">
                <div class ="col-md-3">
                    <h4>Selected Avatar</h4> 
                </div>
                </div>
                <div class="row">
                    <div class="col">
						<img src="resources/img/child-${child.avatar}.png" style="width: 10%">
                </div> 
                </div>
				</br>`; 
                });
				html+=allChildInfo;
		}
	}
	else{
		var all_grades="";
		data.grade.forEach(function(curGrade,ind){
			all_grades+=grade_keys[curGrade];
              if (ind < data.grade.length-1){
                all_grades+= ', ';
              }
		})
		var all_subjects ="";
		data.subjects.forEach(function(subject,ind){
			all_subjects+=subject_keys[subject];
              if (ind < data.subjects.length-1){
                all_subjects+= ', ';
              }
		})
		html+= `
		<div class="row">
				<div class ="col-md-3">
					<h3>Location Preference</h3> 
				</div>
				<div class="col-md-3">
					<h3>Minimum Session Rate</h3> 
				</div>
			</div>
			<div class="row">
				<div class="col-md-3">
					<p class="lead">${all_loc}</p>
				</div>
				<div class="col-md-3">
					<p class="lead">$${data.minSession}</p>
				</div> 
			</div>
		<div class="row">
			<div class="col-md-3">
				<h3>Grade Levels</h3> 
			</div>
		</div>
		<div class="row">
			<div class="col">
				<p class="lead">${all_grades}</p>
			</div> 
		</div>
		<div class="row">
			<div class="col">
				<h3>Subjects</h3> 
			</div>
		</div>
		<div class="row">
			<div class="col">
				<p class="lead">${all_subjects}</p>
			</div> 
		</div>
		<div class="row">
			<div class="col">
				<h3>Profile Picture</h3> 
			</div>
		</div>
		<div class="row">
			<div class="col">
				<img src="${user.photoURL}"  width="15%">
			</div> 
		</div>
		<div class="row">
			<div class="col">
				<h3>About Me</h3> 
			</div>
		</div>
		<div class="row">
			<div class="col">
				<p class="lead">${data.bio}</p>
			</div> 
		</div>
		`;
	}
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
	console.log("DONE");
	return true;
}

function onEdit()
{
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    console.log("User found");
	    var user = firebase.auth().currentUser;

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
				  `;
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

		if (data.children.length > 0){
			console.log(child_counter);
			data.children.forEach(function(child){
				if (child_counter == 0){
					child_counter++;
					console.log(child.grade);
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
					$('#childName').val(child.child_name);
					$('#subjects').val(child.subjects);
					$('#avatar').val(child.avatar);
					$('#grade').val(child.grade).change();
				}
				else{
					addChildForm();
					$('#childName'+child_counter).val(child.child_name);
					$('#grade'+child_counter).val(child.grade);
					$('#subjects'+child_counter).val(child.subjects);
					$('#avatar'+child_counter).val(child.avatar);
				}
			});
		}
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
		for (let id in data){
			if(id == 'location_pref'){
				if (data[id].length > 1 ){
					$('#'+id+"_both").click();
				}
				else{
					$('#'+id+"_online").click();
				}
			}
			else if (id == "grade"){
				data[id].forEach(function(grade){
					$('#grades_'+grade).click();
				})
			}
			else{
				$('#'+id).val(data[id]);
			}
		}
	}
	var subButton = `<div class="form-group row">
	<div class="col-lg-3">
	<button type="submit" class="btn btn-lg btn-primary rounded-pill" form="display-details">Update Profile</button>
	</div>
	</div>`;
	$('#display-details').append(subButton);
	$(".image-picker").imagepicker('refresh');
	$(".selectpicker").selectpicker("refresh");
	$('#minSession').change(function(){
		var newMin = parseFloat($('#minSession').val());
		$('#maxSession').attr('min', newMin);
	  });
	  $('#maxSession').tooltip({
		placement: "right",
		trigger: "focus"
   });
   return;
}


function updateaccount()
{
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    console.log("User found");
	    var user = firebase.auth().currentUser;
		var updateUser = db.collection('users').doc(user.uid);

	    var fname = document.getElementById("fname").value;
		var lname = document.getElementById("lname").value;
		var phone = document.getElementById("phone").value;
		var address = document.getElementById("address").value;
		var apartment_info = document.getElementById("apartment_info").value;
		var city = document.getElementById("city").value;
		var state = document.getElementById("state").value;
		var zipCode = document.getElementById("zipCode").value;
		var min_session = document.getElementById("minSession").value;
		$('#loading_icon').fadeIn();
  		$('#page-container').css('filter', 'blur(1.5rem)');
		if ($('#maxSession').length > 0){
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
			console.log(child_counter);
			
			return updateUser.update({
			"first_name": fname,
			"last_name": lname,
			"phone": phone,
			"address": address,
			"apartment_info": apartment_info,
			"city": city,
			"state": state,
			"zipCode": zipCode,
			"minSession": min_session,
			"maxSession": max_session,
			"location_pref": location_pref,
			"background_check": background_check,
			"children":childData
			})
			.then(()=>{
				return updateUser.get().then((doc) => {
					if (doc.exists) {
						displayProfile(doc.data(),user);
						child_counter = 0;
						$('#loading_icon').css('display','none');
						$('#page-container').css('filter', 'blur(0px)');
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
			if ($('input[name="in_person_sessions"]:checked').val() == "yes"){
				var location_pref = ["in_person","online"];
			}
			else{
				var location_pref = ["online"];
			}
			var grades = [];
			$('input[name="grades"]:checked').each(function() { 
				grades.push(this.value); 
			});
			var subjects = $('#subjects').val()
			var bio = $("#bio").val();

			return updateUser.update({
				"first_name": fname,
				"last_name": lname,
				"phone": phone,
				"address": address,
				"apartment_info": apartment_info,
				"city": city,
				"state": state,
				"zipCode": zipCode,
				"minSession": min_session,
				"location_pref": location_pref,
				"grade":grades,
				"subjects":subjects,
				"bio": bio
				})
			.then(()=>{
				var resumeFile = $('#resume').prop('files')[0];
				var profilePic = $('#photo').prop('files')[0];
				if (resumeFile != undefined || profilePic != undefined){
					if (resumeFile != undefined){
						return uploadResume(resumeFile, user).then(()=>{
							if (profilePic != undefined){
								return uploadPhoto(profilePic, user);
							}
						});
					}
					else{
						return uploadPhoto(profilePic, user);
					}
				}
			})
			.then(()=>{
				return updateUser.get().then((doc) => {
					if (doc.exists) {
						displayProfile(doc.data(),user);
						$('#loading_icon').css('display','none');
						$('#page-container').css('filter', 'blur(0px)');
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
	var picName = 'profilePictures/'+user.uid+'.'+profilePic.name.split('.').pop(); 
	var picRef = storageRef.child(picName);
	const userCollectionRef = db.collection('users').doc(user.uid);
	return picRef.put(profilePic,profilePic.type).then((snapshot) =>{
		console.log("Uploaded profile pic!");
	}).then(()=>{
		var store = firebase.storage();
		return store.ref(picName).getDownloadURL().then((url)=>{
			return user.updateProfile({photoURL: url});
		});
	})
	.then(() =>{
        return storageRef.child(picName).getDownloadURL().then((url) =>{
            return userCollectionRef.update({"photoUrl": url})});
    });
}

function uploadResume(resumeFile, user){
	var storageRef = firebase.storage().ref();
	var resumeName = 'resumes/'+user.uid+'.'+resumeFile.name.split('.').pop();
	var resumeRef = storageRef.child(resumeName);
	const userCollectionRef = db.collection('users').doc(user.uid);
	return resumeRef.put(resumeFile,resumeFile.type).then((snapshot) =>{
		console.log("Uploaded resume!");
	}).then(() => {
        return storageRef.child(resumeName).getDownloadURL().then((url) => {
            return userCollectionRef.update({"resumeUrl": url})});
      });
}

function editPersonalInfo(infoType){
	if (infoType == "email"){
		var user = firebase.auth().currentUser;
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
	$('#personal-info').html(html);
	$('#general-info').fadeOut("fast");
	$('#personal-info').fadeIn();
	console.log(firebase.auth().currentUser);
}

function updateEmail(){
	$('#loading_icon').fadeIn();
	$('#page-container').css('filter', 'blur(1.5rem)');
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
		// Update successful.
		console.log("Email Updated");
		var suc = `<div class="alert alert-success alert-dismissible">
		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		<strong>Success!</strong> Your email has been changed.
	  </div>`
		$('#personal-info').prepend(suc);
		$('#loading_icon').css('display','none');
		$('#page-container').css('filter', 'blur(0px)');
	  }).catch(()=>{
		// An error happened.
		console.log("Failed to update email");
		var fail = `<div class="alert alert-danger alert-dismissible">
		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		<strong>Oh no!</strong> We were unable to change your email.
	  </div>`
		$('#personal-info').prepend(fail);
		$('#loading_icon').css('display','none');
		$('#page-container').css('filter', 'blur(0px)');
	  });
	}).catch(() => {
	// An error happened.
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

function updatePassword(){
	$('#loading_icon').fadeIn();
	$('#page-container').css('filter', 'blur(1.5rem)');
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
		// Update successful.
		console.log("Password Updated");
		var suc = `<div class="alert alert-success alert-dismissible">
		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		<strong>Success!</strong> Your password has been changed.
	  </div>`
		$('#personal-info').prepend(suc);
		$('#loading_icon').css('display','none');
		$('#page-container').css('filter', 'blur(0px)');
	  }).catch(() => {
		// An error happened.
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
	// An error happened.
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
	$("#personal-info").fadeOut();
	$("#general-info").fadeIn();
	$("#personal-info").empty();
}