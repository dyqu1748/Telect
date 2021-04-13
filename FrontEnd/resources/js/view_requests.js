var uuid;
var tutor_num;
var tid;

firebase.auth().onAuthStateChanged(function(user) {
  if (user != null) {
    uuid = user.uid;
    db.collection('users').doc(uuid).get().then((doc) => {
      display_requests(doc.data());
    })
  } else {
    console.log("No user signed in");
    location.replace("index.html");
  }
});

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

// Load the requests based on the tutor's id
function display_requests(data) {
    var html = ``;
    var hasSessions = false;
    db.collection('sessions').where("tutor_id", "==", uuid).where("requested_session", "==", true).get().then((doc) =>
    {
      doc.forEach(req =>
      {
        hasSessions = true;
        if(!hasSessions){
          html += `<h3>No Session Requests</h3>`;
        } 
        else{
          console.log(req.id);
        var req_info = req.data();
        db.collection('users').doc(req_info.user_id).get().then((parent) =>
        {
          console.log(parent.data());
          html += `
            <div class="card w-75">
              <div class="card-body">
                  <h5 class="card-title"> ${parent.data().first_name} ${parent.data().last_name}</h5>
                  <div class="row">
                      <div class="col">`;

          if(req_info.requested_session == true)
          {
            html += `<button onclick="accept_session('${req.id}')" class="btn btn-primary">Accept Request</button> <br><br>`;
            html += `<button onclick="decline_session('${req.id}')" class="btn btn-primary">Decline Request</button>`;
          }else{
            html += `<button class="btn btn-primary">Join Session</button>`;
          }

          html += ` </br>
                      </div>
                      <div class="col">
                          <p class="card-text"> Location: ${req_info.session_loc} </p>
                          <p class="card-text"> Session Cost: ${"$" + req_info.session_cost}</p>
                          <p class="card-text"> Subjects: ${req_info.session_subject}</p>
                          <p class="card-text"> Child: ${req_info.selected_child} </p>
                      </div>
                  </div>
              </div>
            </div>
          `; 
          
          $('#requests').html(html);
        });
        }
      });
    });

    $('#loading_icon').fadeOut("fast");
    $('#page-container').fadeIn();
    return true;
    
 }

// Change the session status to accepted and change the button to be Join Session
function accept_session(data)
{
  modal.style.display = "block";

  console.log(data);

  db.collection('sessions').doc(data).update({
    requested_session : false,
    accepted_session : true,
  });

  db.collection('users').doc(uuid).update({
    "notifications.sessions": firebase.firestore.FieldValue.arrayRemove(data)
  })

  // Display the success message
  var html = `
        <h1> Session Accepted </h1>
  `;
  $('#accept_session').html(html);
}

// Remove session
function decline_session(data)
{
  console.log(data);
  db.collection('sessions').doc(data).get().then((doc)=>{
    var sessData = doc.data();
    db.collection('users').doc(sessData.user_id).update({
      "notifications.sess_cancel":firebase.firestore.FieldValue.arrayUnion(sessData)
    }).then(()=>{
      db.collection('users').doc(uuid).update({
        "notifications.sessions":firebase.firestore.FieldValue.arrayRemove(data)
      });
    }).then(()=>{
      db.collection('sessions').doc(data).delete();
    })
  })
  

  // Display the success message
  var html = `
        <h1> Session Declined </h1>
  `;
  $('#accept_session').html(html);
}




