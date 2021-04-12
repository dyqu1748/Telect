firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("User found");
      var user = firebase.auth().currentUser;
  
      db.collection('users').doc(user.uid).onSnapshot((doc)=> {
        const reveal = async () => {
			const result = await displayHome(doc.data());
			$('#page-container').fadeIn("fast");
		  }
		reveal();
      });
    } else {
      console.log("No user signed in");
      location.replace("index.html");
    }
  });

  function displayHome(data)
{
    var user = firebase.auth().currentUser;
    if (data.user_type == 'parent') {
        var html = `
        <div id= "find_tutors">
            <a class="account_options" href = "find_tutors.html">
                <img class="img-fluid" src="resources/img/find_tutors.png"/>
                <p class="img-label">Find Tutors</p>
            </a>
        </div>
        `;

    } else if (data.user_type == 'tutor') {
        var html = `
        <div id= "view_requests">
            <a class="account_options" href = "view_requests.html"> 
                <img class="img-fluid" src="resources/img/view_requests.png"/>
                <p class="img-label">View Requests</p>
            </a>
        </div>
        `;
        // db.collection('sessions').where("tutor_id", "==", user.uid).where("requested_session", "==", true).get().then((doc) => 
        // {
        //     if(doc.size > 0)
        //     {
        //     	$('#view_requests').append('<span class="dot"></span>');
        //     }
        // })

    }

    html += `
    <div id = "view_schedule">
        <a class="account_options" href = "view_schedule.html">
            <img class="img-fluid" src="resources/img/view_schedule.png"/>
            <p class="img-label">View Schedule</p>
        </a>
    </div>

    <div id = "manage_matches">
        <a class="account_options" href = "manage_matches.html">
            <img class="img-fluid" src="resources/img/manage_matches.png"/>
            <p class="img-label">Manage Matches</p>
        </a>
    </div>

    <div id = "messages">
        <a class="account_options" href = "messages.html">
            <img class="img-fluid" src="resources/img/messages.png"/>
            <p class="img-label">Messages</p>
        </a>
    </div>

    <div id = "donate">
        <a class="account_options" href = "donate.html">
            <img class="img-fluid" src="resources/img/donate.png"/>
            <p class="img-label">Donate</p>
        </a>
    </div>

    <div id = "settings">
        <a class="account_options" href = "settings.html">
            <img class="img-fluid" src="resources/img/settings.png"/>
            <p class="img-label">Settings</p>
        </a>
    </div>
    `;
    //console.log("html", html);

    document.getElementById("user_name").innerHTML ="Hello, " + data.first_name + ".";
    document.getElementById("dashboard").innerHTML = html;
    if (data.notifications !== undefined ){
        if (data.notifications.messages !== undefined){
            if (data.notifications.messages.length > 0){
                $('#messages').append('<span class="dot"></span>');
            } 
        }
        if (data.notifications.sessions !== undefined){
            if (data.notifications.sessions.length > 0){
                $('#view_requests').append('<span class="dot"></span>');
            } 
        }
    }
    if(data.user_type == 'parent')
    {
     db.collection('sessions').where("user_id", "==", user.uid).where("accepted_session", "==", true).get().then((doc) => 
      {
          if(doc.size > 0)
          {
            $('#manage_matches').append('<span class="dot"></span>');
          }
      }) 
    }else if(data.user_type == 'tutor')
    {
      db.collection('sessions').where("tutor_id", "==", user.uid).where("accepted_session", "==", true).get().then((doc) => 
      {
          if(doc.size > 0)
          {
              $('#manage_matches').append('<span class="dot"></span>');
          }
      })
    }
}
