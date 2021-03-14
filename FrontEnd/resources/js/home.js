firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("User found");
      var user = firebase.auth().currentUser;
  
      db.collection('users').doc(user.uid).onSnapshot((doc)=> {
          displayHome(doc.data());
      });
    } else {
      console.log("No user signed in");
      location.replace("index.html");
    }
  });

  function displayHome(data)
{
    if (data.user_type == 'parent') {
        var html = `
        <a href = "find_tutors.html">
        <div id= "find_tutors">
            <img class="img-fluid" src="resources/img/find_tutors.png"/>
            <p>Find Tutors</p>
        </div>
        </a>
        `;

    } else if (data.user_type == 'tutor') {
        var html = `
        <a href = "view_requests.html">
        <div id= "view_requests">
            <img class="img-fluid" src="resources/img/view_requests.png"/>
            <p>View Requests</p>
        </div>
        </a>
        `;

    }

    html += `
    <a href = "view_schedule.html">
    <div id = "view_schedule">
        <img class="img-fluid" src="resources/img/view_schedule.png"/>
        <p>View Schedule</p>
    </div>
    </a>

    <a href = "manage_matches.html">
    <div id = "manage_matches">
        <img class="img-fluid" src="resources/img/manage_matches.png"/>
        <p>Manage Matches</p>
    </div>
    </a>
    
    <a href = "messages.html">
    <div id = "messages">
        <img class="img-fluid" src="resources/img/messages.png"/>
        <p>Messages</p>
    </div>
    </a>

    <a href = "donate.html">
    <div id = "donate">
        <img class="img-fluid" src="resources/img/donate.png"/>
        <p>Donate</p>
    </div>
    </a>

    <a href = "settings.html">
    <div id = "settings">
        <img class="img-fluid" src="resources/img/settings.png"/>
        <p>Settings</p>
    </div>
    </a>
    `;
    //console.log("html", html);
    document.getElementById("user_name").innerHTML += data.first_name + ".";
    document.getElementById("dashboard").innerHTML = html;
	
}
