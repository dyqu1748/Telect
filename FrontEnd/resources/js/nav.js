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
      <li>
      <a href = "find_tutors.html"> Find Tutors </a>
      </li>
      `;

    } else if (data.user_type == 'tutor') {
        var html = `
        <li value = "1">
        <a href = "view_requests.html"> View Requests </a>
        </li>
        `;
    }

    html += `
    <li value = "2">
    <a href = "view_schedule"> View Schedule </a>
    </li>
    <li value = "3">
    <a href = "manage_matches.html" > Manage Matches </a>
    </li>
    <li value = "4">
    <a href = "messages.html" > Messages </a>
    </li>
    <li value = "5">
    <a href = "donate.html" > Donate <a/>
    </li>
    <li value = "6">
    <a href = "settings.html" > Settings <a/>
    </li>
    `;

    document.getElementById("nav_items").innerHTML += html;

  }