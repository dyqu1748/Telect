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
    if (data.user_type == 'parent') {
      var html = `
      <li class="nav-item">
      <a class="nav-link" href = "find_tutors.html"> Find Tutors </a>
      </li>
      `;

    } else if (data.user_type == 'tutor') {
        var html = `
        <li class="nav-item" value = "1">
        <a class="nav-link" href = "view_requests.html"> View Requests </a>
        </li>
        `;
    }

    html += `
    <li class="nav-item" value = "2">
    <a class="nav-link" href = "view_schedule.html"> View Schedule </a>
    </li>
    <li class="nav-item" value = "3">
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
  if (data.notifications !== undefined){
    if (data.notifications.messages.length>0){
        $('#message-nav').append('<span class="dotNav"></span>');
    }
  }

  }