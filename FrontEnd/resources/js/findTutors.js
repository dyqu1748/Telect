var uuid;
var tutor_num;
var docid_arr = [];
firebase.auth().onAuthStateChanged(function(user) {
  if (user != null) {
    uuid = user.uid;
	   getMatches();
  } else {
    console.log("No user signed in");
    location.replace("index.html");
  }
});

String.prototype.hashCode = function(){
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    hash = Math.abs(hash);
    return String(hash);
};


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

function getMatches() {
    $.ajax({
        url: 'https://us-central1-telect-6026a.cloudfunctions.net/tutorMatches/' + uuid,
        success : function(data) {
            console.log(data);
            display_matches(data);
        }
    });
	return true;
}

function display_matches(data) {
    var html = ``;
    var i;
    // var docid_arr = [];
    for(i = 0; i < data.length; i++) {
        var tutorData = data[i];
        var user = firebase.auth().currentUser;
        var docid = (user.uid + tutorData.first_name + tutorData.last_name + tutorData.phone).hashCode();
        docid_arr.push(docid);
        html += `
          <div class="card w-75">
            <div class="card-body">
                <h5 class="card-title"> ${tutorData.first_name} ${tutorData.last_name}</h5>
                <div class="row">
                    <div class="col">
        `;

        var tutor_num_btn = String("request_btn" + i);
        html += `<button id="${tutor_num_btn}" onclick="session_details(${i})" class="btn btn-primary">Request Session</button>`;

        html += ` </br>
                    <a href="#">More Info</a>
                    </div>
                    <div class="col">
                        <p class="card-text"> Location: ${tutorData.city + ", "} ${tutorData.state} </p>
                        <p class="card-text"> Desired Hourly Rate: ${"$" + tutorData.minSession}</p>
                        <p class="card-text"> Subjects: ${tutorData.subjects}</p>
                        <p class="card-text"> About Me: ${tutorData.bio} </p>
                    </div>
                </div>
            </div>
          </div>
        `; 
    }

    // sessionRef = db.collection('sessions');
    // getDocs = sessionRef.get()
    // .then(querySnapshot => {
    //     if (querySnapshot.empty) {
    //       console.log("No documents");
    //     }else{
    //       var j;
    //       var docSnapshots = querySnapshot.doc;
    //       for (j in docSnapshots) {
    //           const doc = docSnapshots[i].data();
    //           if(doc.uid == docid_arr[j] && doc.requested_session)
    //           {
    //             var tutor_num_btn = String("request_btn" + j);
    //             document.getElementById(tutor_num_btn).innerHTML = "Request Pending";
    //             document.getElementById(tutor_num_btn).disabled = true;
    //           }
    //       } 
    //     }
    //   });

    
    // var currDoc = db.collection('sessions').doc(docid).get();
    // currDoc.get().then(function(doc) {
    //   if (doc.exists) {
    //     console.log("Document data:", doc.data());
        
    //   } else {
    //     console.log("No such document!");
    //   }
    // }).catch(function(error) {
    //   console.log("Error getting document:", error);
    // });
    $('#loading_icon').fadeOut("fast");
    $('#page-container').fadeIn();
    $('#tutor-matches').html(html);
	  return true;
 }


function session_details(selected_tutor)
{
  modal.style.display = "block";

  tutor_num = selected_tutor;

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
                  <input type="radio" id="child" value=${user_info.children[i].child_name} required> ${user_info.children[i].child_name}
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
                  <input type="radio" id="location_pref" value="online" required> Online
                  </label>
                  <label class="btn btn-outline-primary">
                  <input type="radio" id="location_pref" value="in_person"> In-Person
                  </label>
                  </div>
                  </div>`;

        }else{
          html += `<div>
                  <div class="btn-group btn-group-toggle" data-toggle="buttons">
                  <label class="btn btn-outline-primary active">
                  <input type="radio" id="location_pref" value="online" > Online
                  </label>
                  <label class="btn btn-outline-primary">
                  <input type="radio" id="location_pref" value="in_person" required> In-Person
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
                  <input type="checkbox" id="subject" value=${tutor_info.subjects[i]}> ${tutor_info.subjects[i]}
                  </label>
                  `;
        }

        html += `
                </br>
                <button type="submit" class="btn btn-lg btn-primary">Send Request</button>
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
 	// var tutor_num = document.getElementById("selected_tutor").innerHTML;
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

                var docid = (user.uid + tutor_info.first_name + tutor_info.last_name + tutor_info.phone).hashCode();
                console.log(docid);
                db.collection('sessions').doc(docid).set({
                  requested_session : true,
                  accepted_session : false,
                  completed_session : false,
                  user_id : user.uid,
                  tutor_fname : tutor_info.first_name,
                  tutor_lname : tutor_info.last_name,
                  tutor_phone : tutor_info.phone,
                  selected_child : document.getElementById("child").value,
                  session_cost : document.getElementById("final_price").value,
                  session_loc : document.getElementById("location_pref").value,
                  session_subject : document.getElementById("subject").value
                });

                // Display the success message
                var html = `
                      <h1> Session Request Sent </h1>
                `;
                $('#schedule_session').html(html);

                var tutor_num_btn = String("request_btn" + tutor_num);
                document.getElementById(tutor_num_btn).innerHTML = "Request Pending";
                document.getElementById(tutor_num_btn).disabled = true;
            });
        }
    });
    return true;
 }
