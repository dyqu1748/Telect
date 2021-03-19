// Schedule Session
// Select time
// Change payment
// Submit -- display submit
// If session pending, display pending message instead of schedule session
// Upon confirmation from tutor, display session details until session is completed

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function loadMatches()
{
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    console.log("User found");
	    var user = firebase.auth().currentUser;
		console.log(user.uid);

		db.collection('users').doc(user.uid).onSnapshot((doc)=> {
			console.log(doc.data());
			getMatches(user.uid);
		});
	  } else {
	    console.log("No user signed in");
		location.replace("index.html");
	  }
	});	
}


function getMatches(uuid) {
   var getTutorMatches = firebase.functions().httpsCallable('tutorMatches');
   getTutorMatches().then((result) => {
       // Read result of the Cloud Function.
       var sanitizedMessage = result.data.text;
       console.log(sanitizedMessage);
     });
   $.ajax({
       url: 'https://us-central1-telect-6026a.cloudfunctions.net/tutorMatches/' + uuid,
       success : function(data) {
           console.log(data);
           display_matches(data);
       }
   });
 }

function display_matches(data)
{
 	var html = ``;
 	var i;
 	for(i = 0; i < data.length; i++)
 	{
 		
 		html += `
 		  <div class="card">
 		  <p id="selected_tutor" style="display: none;">${i}</p>
 		  <h1>${data[i].first_name} ${data[i].last_name}</h1>
		  <button onclick="session_details()">Request Session</button>
		  </div>
		  `;
 	}
 	$('#tutors').html(html);
	$('#loading_icon').fadeOut("fast");
	$('#page-container').fadeIn();
 }

function session_details()
{
	modal.style.display = "block";

	var tutor_num = document.getElementById("selected_tutor").innerHTML;

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
		           var html = `
				           <h1>Request a Session with ${tutor_info.first_name} ${tutor_info.last_name}</h1>
				           <h3>Select Which Child</h3>
				           `;

				    for (var i = 0; i < user_info.children.length; i++) {
						html += `
						<label>
							<input type="radio" name="child" value=${user_info.children[i].child_name} required> ${user_info.children[i].child_name}
						</label>
						`;
					}

				    html += `
				           <h3>Date and Time</h3>
				           <h3>Location Preference</h3>
				           `;
		           if(user_info.location_pref == "online")
		           {
		           		html += `<div>
									<div class="btn-group btn-group-toggle" data-toggle="buttons">
										<label class="btn btn-outline-primary active">
										<input type="radio" name="location_pref" value="online" required> Online
										</label>
										<label class="btn btn-outline-primary">
										<input type="radio" name="location_pref" value="in_person"> In-Person
										</label>
									</div>
								</div>`;

		           }else{
		           		html += `<div>
								<div class="btn-group btn-group-toggle" data-toggle="buttons">
									<label class="btn btn-outline-primary active">
									<input type="radio" name="location_pref" value="online" > Online
									</label>
									<label class="btn btn-outline-primary">
									<input type="radio" name="location_pref" value="in_person" required> In-Person
									</label>
								</div>
								</div>`;
		           }
		           		          
		           html += `
				           <h3>Price</h3>
				           <p>Your Current Price Range: $${user_info.minSession} - $${user_info.maxSession}</p>
				           <p>Tutor Current Price Range: $${tutor_info.minSession} - $${tutor_info.maxSession}</p>
				           <div>
				           <p> Please Input the Session Price</p>
							<input type="number" id="final_price" class="form-control" min="${tutor_info.minSession}" value="${user_info.minSession}" placeholder="0.00" required>
							</div>
				           <h3>Select Subject</h3>
				           <div id="subjectsel">
				           </div>
		          			 `;

					for (var i = 0; i < tutor_info.subjects.length; i++) {
						html += `
						<label>
							<input type="checkbox" value=${tutor_info.subjects[i]}> ${tutor_info.subjects[i]}
						</label>
						`;
					}

					html += `
							<button type="submit" class="btn btn-lg btn-primary">Confirm Session</button>
					`;
		          	
		           $('#schedule_session').html(html);
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
	var html = `
				<h1> Session Request Sent </h1>
	`;
	$('#schedule_session').html(html);
}








