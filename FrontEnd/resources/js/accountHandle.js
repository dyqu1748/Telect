firebase.auth().onAuthStateChanged(function(user) {
  if (user != null) {

    var notLoggedInPages = ['Telect - Sign In','Telect - Welcome','Telect - Reset Password'];
    var pageName = document.title;
    // If user is signed in, redirect them to the home dashboard if they're on the landing page, login page, or password reset page.
    if (notLoggedInPages.includes(pageName)){
      location.replace("home.html");
    }
    // User is signed in. Show appropiate elements for signed in user and vice-versa.
    $('[class$="logged_in"]').css('display', 'block');
    $('[class$="not_logged_in"]').css('display', 'none');

  } else {
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

  //Attempt to login user with provided credentials
  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function() {
	  location.replace("home.html");
	})
	.catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    // Display error message to user
    $('#error-message').html(errorMessage);
    $('#error-row').fadeIn();

    // ...
  });
  return false;
}

function resetPassword(){
  var userEmail = document.getElementById("inputEmail").value;
  $('#error-message').empty();
  $('#error-row').css('display', 'none');
  // Send reset link to provided email
  firebase.auth().sendPasswordResetEmail(userEmail).then(function() {
    // Email sent.
    document.getElementById("logged_in").style.display = "block";
    document.getElementById("not_logged_in").style.display = "none";
  }).catch(function(error) {
    // An error happened.
    var errorMessage = error.message;
	  // Display error to user
	  $('#error-message').html(errorMessage);
    $('#error-row').fadeIn();
  });
  return false;
}

function logout(){
  firebase.auth().signOut();
  // Redirect user back to landing page
  location.replace("index.html");
  return true;
}

function verify_email(){
	var user = firebase.auth().currentUser;

// Send verification email to user
user.sendEmailVerification().then(function() {
  // Email sent.
}).catch(function(error) {
  // An error happened.
  window.alert("Error : " + errorMessage);
});
return true;
}

