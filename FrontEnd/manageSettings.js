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
  }
});

function displayProfile(data)
{
	// Account Info
	var html =  `<div>
					Name<br>${data.first_name} ${data.last_name}
			  </div>
			  <div>
			  		Email<br>
			  		${data.email}
			  </div>
			  <div>
			  		Phone Number<br>${data.phone}
			  </div>
			  <div>
				  Address<br> ${data.address} ${data.apartment_info}<br>
				  ${data.city}, ${data.state} ${data.zipCode}
			  </div>
			  <div>
				  Session Payment Range<br> ${data.minSession} to ${data.maxSession}
			  </div>
			  <div>
			  	  Location Preference<br>
			  	  <p>${data.location_pref}</p>
			  </div>
			  <button onclick="onEdit()">Edit Profile</button>
				  `;
	var displayDetails = document.getElementById('display-details');
	displayDetails.innerHTML = html;
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

function editProfile(data)
{
	// Display info in an editable form
	var userInfo =  `
	 		  <div>
					Name<br><input type="text" id="fname" value="${data.first_name}" placeholder="First Name">
					<input type="text" id="lname" value="${data.last_name}" placeholder="Last Name">
			  </div>
			  <div>
			  		Email<br><input type="email" id="email" class="form-control" value="${data.email}" placeholder="Email">
			  </div>
			  <div>
			  		Phone Number<br><input type="tel" id="phone" class="form-control" value="${data.phone}" placeholder="Phone Number">
			  </div>
			  <div>
				  Address<br> <input type="text" id="address" class="form-control" value="${data.address}" placeholder="Address">
				  <input type="text" id="apartment_info" class="form-control" value="${data.apartment_info}" placeholder="Apartment Info"> <br>
				  <input type="text" id="city" class="form-control" value="${data.city}" placeholder="City"> 
				  <input type="text" id="state" class="form-control" value="${data.state}" placeholder="State">
				  <input type="number" id="zipCode" class="form-control" value="${data.zipCode}" placeholder="Zip Code">
			  </div>
			  <div>
				  Session Payment Range<br> <input type="number" id="max-session" class="form-control" value="${data.maxSession}" placeholder="0.00">
				  <input type="number" id="min-session" class="form-control" value="${data.minSession}" placeholder="0.00"> <br>
			  </div>
			  <div>
			  	  Location Preference<br>
			  	  <label class="btn btn-outline-primary active">
                  <input type="radio" name="location_pref" value=${data.location_pref} checked> Online
                  </label>
                  <label class="btn btn-outline-primary">
                  <input type="radio" name="location_pref" value="in_person"> In-Person
                  </label>
			  </div>
			  <input type="submit" value="Update Profile">
				  `;
	var editDetails = document.getElementById('display-details');
	editDetails.innerHTML = userInfo;
}

function updateaccount()
{
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    console.log("User found");
	    var user = firebase.auth().currentUser;

	    var fname = document.getElementById("fname").value;
		var lname = document.getElementById("lname").value;
		var email = document.getElementById("email").value;
		var phone = document.getElementById("phone").value;
		var address = document.getElementById("address").value;
		var apartment_info = document.getElementById("apartment_info").value;
		var city = document.getElementById("city").value;
		var state = document.getElementById("state").value;
		var zipCode = document.getElementById("zipCode").value;
		var min_session = document.getElementById("min-session").value;
		var max_session = document.getElementById("max-session").value;
		var location_pref = $('input[name="location_pref"]:checked').val();

		var updateUser = db.collection('users').doc(user.uid);

	    updateUser.update({
	      "email": email,
	      "first_name": fname,
	      "last_name": lname,
	      "phone": phone,
	      "address": address,
	      "apartment_info": apartment_info,
	      "city": city,
	      "state": state,
	      "minSession": min_session,
	      "maxSession": max_session,
	      "location_pref": location_pref
	    })
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

