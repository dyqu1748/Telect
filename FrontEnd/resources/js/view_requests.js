// Variables used for later
var uuid;
var tutor_num;
var tid;

// Get the current logged in user
firebase.auth().onAuthStateChanged(function(user) {
  if (user != null) {
    uuid = user.uid;
    db.collection('users').doc(uuid).onSnapshot((doc) => {
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
      console.log(doc.empty);
      if (doc.empty){
        html += `<h1 class="text-center">No Session Requests</h1>`;
        $('#requests').html(html);
      }
      else{
        html+=`<h1 class="text-center">Here are Your Requests</h1><br>`;
      }
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
          <div class="form-group row" id="req_${req.id}">
          <div class="card w-75 mx-auto">
              <div class="card-body">
                  <h5 class="card-title"> ${parent.data().first_name} ${parent.data().last_name}</h5>
                  <div class="row">
                      <div class="col">`;

          if(req_info.requested_session == true)
          {
            html += `<button onclick="accept_session('${req.id}')" class="btn btn-primary rounded-pill">Accept Request</button> <br><br>`;
            html += `<button onclick="decline_session('${req.id}')" class="btn btn-primary rounded-pill">Decline Request</button>`;
          }

          var day = req_info.session_time.match(/[a-zA-Z]+/g);
          var time = String(req_info.session_time.match(/\d+/g));
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

          var subject_keys = {'math':'Math','geometry':'Geometry','pre-algebra':'Pre-Algebra','algebra':'Algebra','science':'Science','geology':'Geology','chemistry':'Chemistry','social_studies':'Social Studies','govtHist': 'U.S. Government and History','language_arts':'Language Arts','spanish': 'Spanish'};
          var subjects = "";
          req_info.session_subject.forEach(function(sub,ind){
            subjects+=subject_keys[sub] + " ";
            if (ind < req_info.session_subject.length-1){
              subjects+= ', ';
            }
          });

          html += ` </br>
                      </div>
                      <div class="col">
                          <p class="card-text"> Child: ${req_info.selected_child} </p>
                          <p class="card-text"> Session Date: ${day} ${time}</p>
                          <p class="card-text"> Location: ${req_info.session_loc.charAt(0).toUpperCase() +req_info.session_loc.slice(1)} </p>
                          <p class="card-text"> Session Cost: ${"$" + req_info.session_cost}</p>
                          <p class="card-text"> Subjects: ${subjects}</p>
                          
                      </div>
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
  // modal.style.display = "block";

  console.log(data);

  db.collection('sessions').doc(data).update({
    requested_session : false,
    accepted_session : true,
  });

  db.collection('users').doc(uuid).update({
    "notifications.sessions": firebase.firestore.FieldValue.arrayRemove(data)
  })

  db.collection('sessions').doc(data).get().then((doc)=>{
    var sessInfo = doc.data();
    var user_id = sessInfo.user_id;
    var day = sessInfo.session_time.match(/[a-zA-Z]+/g);
        var time = String(sessInfo.session_time.match(/\d+/g));
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
    db.collection('users').doc(user_id).get().then((userDoc)=>{
      var otherUserData = userDoc.data()
      var testHTML = `<br><div class="alert alert-success alert-dismissible fade show" role="alert">
        You have accepted ${otherUserData.first_name} ${otherUserData.last_name}'s ${day}, ${time} session.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`;
      $('#requests').prepend(testHTML);
    });
  })
  $('#req_'+data).fadeOut(300,function(){this.remove();});
  
}

// Remove session
function decline_session(data)
{
  console.log(data);
  db.collection('sessions').doc(data).get().then((doc)=>{
    var sessInfo = doc.data();
    var user_id = sessInfo.user_id;
    var day = sessInfo.session_time.match(/[a-zA-Z]+/g);
        var time = String(sessInfo.session_time.match(/\d+/g));
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
    db.collection('users').doc(user_id).get().then((userDoc)=>{
      var otherUserData = userDoc.data()
      var testHTML = `<br><div class="alert alert-success alert-dismissible fade show" role="alert">
        You have accepted ${otherUserData.first_name} ${otherUserData.last_name}'s ${day}, ${time} session.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`;
      $('#requests').prepend(testHTML);
    });
    db.collection('users').doc(sessInfo.user_id).update({
      "notifications.sess_cancel":firebase.firestore.FieldValue.arrayUnion(sessInfo)
    }).then(()=>{
      db.collection('users').doc(uuid).update({
        "notifications.sessions":firebase.firestore.FieldValue.arrayRemove(data)
      });
    }).then(()=>{
      db.collection('sessions').doc(data).delete();
    })
  })
  

  $('#req_'+data).fadeOut(300,function(){this.remove();});
}




