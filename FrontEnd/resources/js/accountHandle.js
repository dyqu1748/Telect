firebase.auth().onAuthStateChanged(function(user) {
  if (user != null) {
    // User is signed in. Show appropiate elements for signed in user and vice-versa.
    console.log("USER SIGNED IN");
    var notLoggedInPages = ['Telect - Sign In','Telect - Welcome','Telect - Reset Password', 'Telect - Account Register'];
    var pageName = document.title;
    if (notLoggedInPages.includes(pageName)){
      location.replace("home.html");
    }
    $('[class$="logged_in"]').css('display', 'block');
    $('[class$="not_logged_in"]').css('display', 'none');

  } else {
    console.log("USER NOT SIGNED IN");
    // No user is signed in. Display appropriate elements.
    $('[class$="logged_in"]').css('display', 'none');
    $('[class$="not_logged_in"]').css('display', 'block');
  }
});

function login(){

  var userEmail = document.getElementById("inputEmail").value;
  var userPass = document.getElementById("inputPassword").value;
  $('#error-message').empty();
  $('#error-row').css('display', 'none');

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function() {
	  location.replace("home.html");
	})
	.catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    // window.alert("Error : " + errorMessage);
    $('#error-message').html(errorMessage);
    $('#error-row').fadeIn();

    // ...
  });
  return false;
}

function resetPassword(){
  var userEmail = document.getElementById("inputEmail").value;
  firebase.auth().sendPasswordResetEmail(userEmail).then(function() {
    // Email sent.
    document.getElementById("logged_in").style.display = "block";
    document.getElementById("not_logged_in").style.display = "none";
  }).catch(function(error) {
    // An error happened.
    var errorMessage = error.message;
	  
	  window.alert("Error : " + errorMessage);
  });
}

//Log user out and refresh page to diplay correct elements
function logout(){
  firebase.auth().signOut();
  location.replace("index.html");
  return true;
}

function verify_email(){
	var user = firebase.auth().currentUser;

user.sendEmailVerification().then(function() {
  // Email sent.
}).catch(function(error) {
  // An error happened.
});
return true;
}

