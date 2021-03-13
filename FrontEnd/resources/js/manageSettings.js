// Get current user
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("User found");
    var user = firebase.auth().currentUser;
	console.log(user.uid);

	db.collection('users').doc(user.uid).onSnapshot((doc)=> {
		console.log(doc.data());
		displayProfile(doc.data());
	});
  } else {
    console.log("No user signed in");
	location.replace("index.html");
  }
});

function displayProfile(data)
{
	// Account Info
	for (let key in data){
		console.log(key);
	}
	var html =  `<div class="row">
					<div class ="col-md-3">
						<h3>Name</h3>
					</div>
			  	</div>
				<div class ="row">
					<div class="col-md-3">
						<p class="lead">${data.first_name} ${data.last_name}</p>
					</div>
				</div>
			  <div class="row">
			  	<div class="col-md-3">
			  		<h3>Email</h3>
				</div>
			  </div>
			  <div class="row">
			 	<div class="col-md-3">
				 	<p class="lead">${data.email}</p>
				 </div> 
			  </div>
			  <div class="row">
			  	<div class="col-md-3">
					<h3>Phone Number</h3>
				</div>
			  </div>
			  <div class="row">
			 	<div class="col-md-3">
				 	<p class="lead">${data.phone}</p>
				 </div> 
			  </div>
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
			  <div class="row">
				<div class ="col-md-3">
					<h3>Location Preference</h3> 
				</div>
			</div>
			<div class="row">
				<div class="col">
					<p class="lead">${data.location_pref}</p>
				</div> 
			</div>
				  `;
	if (data.user_type == 'parent'){
		html+= `
		<div class="row">
			<div class="col-md-3">
				<h3>Session Payment Range</h3> 
			</div>
		</div>
		<div class="row">
			<div class="col-md-3">
				<p class="lead">$${data.minSession} to $${data.maxSession}</p>
			</div> 
		</div>
		`;
		if (data.children.length > 0){
			var allChildInfo = `<br><h3>Child Information</h3><br>`;
            data.children.forEach(function(child,index){
                allChildInfo += `
                <div class="row">
                <div class="col-md-3">
                    <h3>Child ${index+1}</h3> 
                </div>
                </div>
                <div class="row">
                <div class="col-md-3">
                    <h3>Child Name</h3> 
                </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <p class="lead">${child.child_name}</p>
                    </div> 
                </div>
                <div class="row">
                <div class ="col-md-3">
                    <h3>Grade Level</h3> 
                </div>
                </div>
                <div class="row">
                    <div class="col">
                        <p class="lead">${child.grade}</p>
                </div> 
                </div>
                <div class="row">
                <div class ="col-md-3">
                    <h3>Subjects</h3> 
                </div>
                </div>
                <div class="row">
                    <div class="col">
                        <p class="lead">${child.subjects}</p>
                </div> 
                </div>
                <div class="row">
                <div class ="col-md-3">
                    <h3>Selected Avatar</h3> 
                </div>
                </div>
                <div class="row">
                    <div class="col">
                        <p class="lead">${child.avatar}</p>
                </div> 
                </div>`; 
                });
				html+=allChildInfo;
		}
	}
	else{
		html+= `
		<div class="row">
			<div class="col-md-3">
				<h3>Minimum Session Rate</h3> 
			</div>
		</div>
		<div class="row">
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
			<div class="col-md-3">
				<p class="lead">${data.grade}</p>
			</div> 
		</div>
		<div class="row">
			<div class="col-md-3">
				<h3>Subjects</h3> 
			</div>
		</div>
		<div class="row">
			<div class="col-md-3">
				<p class="lead">${data.subjects}</p>
			</div> 
		</div>
		<div class="row">
			<div class="col-md-3">
				<h3>About Me</h3> 
			</div>
		</div>
		<div class="row">
			<div class="col-md-3">
				<p class="lead">${data.bio}</p>
			</div> 
		</div>
		`;
	}
	html += `<button class="btn btn-secondary" onclick="onEdit()">Edit Profile</button>`;
	$('#display-details').html(html);
}

function onEdit()
{
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    console.log("User found");
	    var user = firebase.auth().currentUser;

		db.collection('users').doc(user.uid).onSnapshot((doc)=> {
			console.log(doc.data());
			editProfile(doc.data());
		});
	  } else {
	    console.log("No user signed in");
	  }
	});
}


var child_counter = 0;
function editProfile(data)
{
	// Display info in an editable form
	var userInfo =  `
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
		<label for="email" class="control-label">Email</label>
		<input type="email" id="email" class="form-control" value="${data.email}" placeholder="Email" required>
	</div>
</div>

<div class="form-group row">
	<div class="col-md-6">
		<label for="phone" class="control-label">Phone Number</label>
		<input type="tel" id="phone" class="form-control" placeholder="Phone Number" value="${data.phone}" pattern="[0-9]{10}" required>
		<small id="phoneHelp" class="form-text text-muted">Format: 1234567890</small>
	</div>
</div>

<h2>Add your current address</h2>

<div class="form-group row">
	<div class="col-md-6">
		<label for="address" class="control-label">Address</label>
		<input type ="text" id="address" class="form-control" value="${data.address}" placeholder="Address" required>
	</div>
</div>

<div class="form-group row">
	<div class="col-md-3">
		<label for="apartmentInfo">Apartment Info</label>
		<input type = "number" id="apartmentInfo" class="form-control" value="${data.apartment_info}" placeholder="Apartment #, floor, etc.">
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
				  `;
	if (data.user_type == "parent"){
		userInfo+= `
		<div>
			Session Payment Range<br>
			<input type="number" id="minSession" class="form-control" min="0.00" value="${data.minSession}" placeholder="0.00" required> <br>
			<input type="number" id="maxSession" class="form-control" min="${data.minSession}" value="${data.maxSession}" placeholder="0.00" required>
		</div>
		<div>
			Location Preference<br>
			<div class="btn-group btn-group-toggle" data-toggle="buttons">
				<label class="btn btn-outline-primary active">
				<input type="radio" name="location_pref" value="online" required> Online
				</label>
				<label class="btn btn-outline-primary">
				<input type="radio" name="location_pref" value="in_person"> In-Person
				</label>
			</div>
		</div>
		<div>
			Background Check Preference<br>
			<div class="btn-group btn-group-toggle" data-toggle="buttons">
				<label class="btn btn-outline-primary active">
				<input type="radio" name="background_check" id="background_check_yes" value="yes" required> Yes
				</label>
				<label class="btn btn-outline-primary">
				<input type="radio" name="background_check" id="background_check_no" value="no" > No
				</label>
			</div>
		</div>`;
		$('#display-details').html(userInfo);
		$('#state').val(data.state).change();
		$('input[name="location_pref"][value="'+data.location_pref+'"]').click();
		$('input[name="background_check"][value="'+data.background_check+'"]').click();

		if (data.children.length > 0){
			data.children.forEach(function(child){
				if (child_counter == 0){
					child_counter++;
					console.log(child.grade);
					var childInfo=`
					<div><h3>Child ${child_counter}</h3>
					<h3>Add your child's full name (optional)</h3>
					<input type ="text" id="childName" class="form-control" placeholder="Child's Full Name">
					<h3 class="header-control">Add your child's current grade level</h3>
				
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
				
					<h3 class="header-control">Select the subjects your child needs help with</h3>
				
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
				
					<h3 class="header-control">Choose an avatar for your child</h3>
					<select id="avatar" class="image-picker show-html" required>
						<option data-img-src="https://c-sf.smule.com/rs-s23/arr/d6/75/227c4be5-3914-427b-91be-eac339869d70_1024.jpg" value="avatar1">Avatar 1</option>
						<option data-img-src="https://static.zerochan.net/Dango.%28CLANNAD%29.full.113867.jpg" value="avatar2">Avatar 2</option>
						<option data-img-src="https://static.zerochan.net/Dango.%28CLANNAD%29.full.113865.jpg" value="avatar3">Avatar 3</option>
					</select>
						</div>`;
					$('#display-details').append(childInfo);
					$('#childName').val(child.child_name);
					$('#subjects').val(child.subjects);
					$('#avatar').val(child.avatar);
					$('#grade').val(child.grade);
				}
				else{
					child_counter++;
					childInfo =`
					<div>Child ${child_counter}
								<input type ="text" id="childName${child_counter}" class="form-control" placeholder="Child's Full Name">
						<h3>Add your child's current grade level</h3>

						<select class="selectpicker" id="grade${child_counter}" title="Select Grade Level" required>
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

						<h3>Select the subjects your child needs help with</h3>

						<select class="selectpicker" id ='subjects${child_counter}' data-live-search="true" multiple title="Select Subjects"  required>
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

						<h3>Choose an avatar for your child</h3>
						<select id="avatar${child_counter}" class="image-picker show-html" required>
							<option data-img-src="https://c-sf.smule.com/rs-s23/arr/d6/75/227c4be5-3914-427b-91be-eac339869d70_1024.jpg" value="avatar1">Avatar 1</option>
							<option data-img-src="https://static.zerochan.net/Dango.%28CLANNAD%29.full.113867.jpg" value="avatar2">Avatar 2</option>
							<option data-img-src="https://static.zerochan.net/Dango.%28CLANNAD%29.full.113865.jpg" value="avatar3">Avatar 3</option>
						</select>`;
					$('#display-details').append(childInfo)
					$('#childName'+child_counter).val(child.child_name);
					$('#grade'+child_counter).val(child.grade);
					$('#subjects'+child_counter).val(child.subjects);
					$('#avatar'+child_counter).val(child.avatar);
				}
			});
		}
	}
	else{
		userInfo+=`
		<h3 class="header-control">Enter the minimum pay rate you would like to receive for a session</h3>
                <div class="form-group form-inline">
                    <label for="minSession">$</label>
                    <div class="col-md-3">
                        <input type="number" id="minSession" min="0.00" class="form-control" step="0.01" placeholder="0.00" required>
                    </div>
                </div>

                <h3 class="header-control">List the subjects you are interested in</h3>
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
                
                <h3 class="header-control">Which grade levels are you interested in working with? (Select all that apply)</h3>
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

                <h3 class="header-control">Are you comfortable with doing in-person sessions along with online sessions?</h3>
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

                <h3 class="header-control">Tell us a a little about yourself</h3>
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
	var subButton = `<button type="submit" class="btn btn-lg btn-primary">Update Profile</button>`;
	$('#display-details').append(subButton);
	$(".image-picker").imagepicker('refresh');
	$('.selectpicker').selectpicker('refresh');
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
		var email = document.getElementById("email").value;
		var phone = document.getElementById("phone").value;
		var address = document.getElementById("address").value;
		var apartment_info = document.getElementById("apartment_info").value;
		var city = document.getElementById("city").value;
		var state = document.getElementById("state").value;
		var zipCode = document.getElementById("zipCode").value;
		var min_session = document.getElementById("minSession").value;
		
		if ($('maxSession').length > 0){
			var max_session = document.getElementById("maxSession").value;
			var location_pref = $('input[name="location_pref"]:checked').val();

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
			child_counter = 0;

			updateUser.update({
			"email": email,
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
			"children":childData
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

			updateUser.update({
				"email": email,
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
				});

		}
		setTimeout(() => {  
			updateUser.get().then((doc) => {
				if (doc.exists) {
					displayProfile(doc.data());
				} else {
					// doc.data() will be undefined in this case
					console.log("No such document!");
				}
			}).catch((error) => {
				console.log("Error getting document:", error);
			});
			// displayProfile(updateUser);
	}, 1000);
	  } else {
	    console.log("No user signed in");
	  }
	});
	return false;
	
}

// const editProfile = () -> (
// 	const newName = {
// 		newFirstName: first_name.value,
// 		newLastName: last_name.value
// 	};
// 	const newEmail = email.value;

// 	const user = firebase.auth().currentUser;
// 	updateName(user, newName);
// }

// const newName = (user, newName) => {
// 	const {newFirstName, newLastName} = newName;
// 	user.updateProfile({
// 		first_name: nfirst_name,
// 		last_name: nlast_name
// 	})
// 	.then(() => {
// 		console.log("Profile successfully updated");
// 	})
// 	.catch(error -> {
// 		console.error(error);
// 	})
// }

// editButton.addEventListener('click', editInformation);

