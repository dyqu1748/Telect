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
    db.collection('sessions').where("tutor_id", "==", uuid).where("requested_session", "==", true).get().then((doc) =>
    {
      doc.forEach(req =>
      {
        console.log(req.id);
        var req_info = req.data();
        db.collection('users').doc(req_info.user_id).get().then((parent) =>
        {
          if(req_info.accepted_session == true)
          {
            return true;
          }
          console.log(parent.data());
          html += `
            <br>
            <div class="card w-75">
              <div class="card-body">
                  <h5 class="card-title"> ${parent.data().first_name} ${parent.data().last_name}</h5>
                  <div class="row">
                      <div class="col">`;

          if(req_info.requested_session == true)
          {
            html += `<button onclick="accept_session('${req.id}')" class="btn btn-primary">Accept Request</button> <br><br>`;
            html += `<button onclick="decline_session()" class="btn btn-primary">Decline Request</button>`;
          }

          var printTime;
          for(var c = 0; c < req_info.session_time.length; c++)
          {
            if(req_info.session_time[c] >= '0' && req_info.session_time[c] <= '9')
            {
              printTime = req_info.session_time.substr(0, c) + " " + req_info.session_time.substr(c+1, req_info.session_time.length);
              break;
            }
          }

          html += ` </br>
                      </div>
                      <div class="col">
                          <p class="card-text"> Child: ${req_info.selected_child} </p>
                          <p class="card-text"> Session Date: ${printTime}</p>
                          <p class="card-text"> Location: ${req_info.session_loc.charAt(0).toUpperCase() +req_info.session_loc.slice(1)} </p>
                          <p class="card-text"> Session Cost: ${"$" + req_info.session_cost}</p>
                          <p class="card-text"> Subjects: ${req_info.session_subject.charAt(0).toUpperCase() +req_info.session_subject.slice(1)}</p>
                          
                      </div>
                  </div>
              </div>
            </div>
          `; 
          
          $('#requests').html(html);
        });
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

  // Display the success message
  var html = `
        <h1> Session Accepted </h1>
  `;
  $('#accept_session').html(html);
}

// Remove session
function decline_session()
{
  console.log(data);

  db.collection('sessions').doc(data).delete();

  // Display the success message
  var html = `
        <h1> Session Declined </h1>
  `;
  $('#accept_session').html(html);
}




