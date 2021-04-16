firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("User found");
      var user = firebase.auth().currentUser;
  
      db.collection('users').doc(user.uid).onSnapshot((doc)=> {
          displayNav(doc.data());
      });
    } else {
      console.log("No user signed in");
      location.replace("index.html");
    }
  });

  function displayNav(data) 
  {
    var user = firebase.auth().currentUser;
    if (data.user_type == 'parent') {
      var html = `
      <li class="nav-item">
      <a class="nav-link" href = "find_tutors.html"> Find Tutors </a>
      </li>
      `;

    } else if (data.user_type == 'tutor') {
        var html = `
        <li class="nav-item" value = "1" id="view_requests-nav">
        <a class="nav-link" href = "view_requests.html"> View Requests </a>
        </li>
        `;

        db.collection('sessions').where("tutor_id", "==", user.uid).where("requested_session", "==", true).get().then((doc) => 
        {
            doc.forEach(req =>
            {
                $('#view_requests_nav').append('<span class="dotNav"></span>');
            })
        })
    }

    html += `
    <li class="nav-item" value = "2">
    <a class="nav-link" href = "view_schedule.html"> View Schedule </a>
    </li>
    <li class="nav-item" value = "3" id="manage_matches-nav">
    <a class="nav-link" href = "manage_matches.html" > Manage Matches </a>
    </li>
    <li class="nav-item" value = "4" id="message-nav">
    <a class="nav-link" href = "messages.html" > Messages </a>
    </li>
    <li class="nav-item" value = "5">
    <a class="nav-link" href = "donate.html" > Donate </a>
    </li>
    <li class="nav-item" value = "6">
    <a class="nav-link" href = "settings.html" > Settings </a>
    </li>
    `;

    document.getElementById("nav_items").innerHTML = html;
    var navClass = document.getElementsByClassName("nav-link");
    var path = window.location.href;

    for (i = 0; i < navClass.length; i++) {
    if (path.includes(navClass[i].href)) {
        navClass[i].classList.add("active");
    }
  }

  if (data.notifications !== undefined ){
    if (data.notifications.messages !== undefined){
        if (data.notifications.messages.length > 0){
            $('#message-nav').append('<span class="dotNav"></span>');
        }
    }
    if (data.notifications.sessions !== undefined){
      if (data.notifications.sessions.length > 0){
        if (data.user_type == "tutor"){
            $('#view_requests-nav').append('<span class="dotNav"></span>');
        }
        else{
            $('#manage_matches-nav').append('<span class="dotNav" id="notif_match_nav"></span>');
        }
      }
    }
    if (data.notifications.sess_cancel !== undefined){
      if(data.notifications.sess_cancel.length>0 && $("#notif_match_nav").length === 0){
          $('#manage_matches-nav').append('<span class="dotNav" id="notif_match_nav"></span>');
      }
  }
}

  }