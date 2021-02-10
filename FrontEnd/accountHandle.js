firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in. Show appropiate elements for signed in user and vice-versa.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){
      // Change elements for signed in user.
      location.replace("index.html");
    }

  } else {
    // No user is signed in. Display appropriate elements.

  }
});

function login(){

  var userEmail = document.getElementById("inputEmail").value;
  var userPass = document.getElementById("inputPassword").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function() {
	  location.replace("index.html");
	})
	.catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function resetPassword(){
  var userEmail = document.getElementById("inputEmail").value;
  firebase.auth().sendPasswordResetEmail(userEmail).then(function() {
    // Email sent.
    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";
  }).catch(function(error) {
    // An error happened.
    var errorMessage = error.message;
	  
	  window.alert("Error : " + errorMessage);
  });
}

function create_account(){
	var userEmail = document.getElementById("inputEmail").value;
	var userPass = document.getElementById("inputPassword").value;
  var fName = document.getElementById("fName").value;
  var lName  = document.getElementById("lName").value;
  var phone = document.getElementById("phone").value;
  var address = document.getElementById("address").value;
  var apartmentInfo = document.getElementById("apartmentInfo").value;
  var city = document.getElementById("city").value;
  var state = document.getElementById("state").value;
		
	firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).then(function() {
		verify_email();

    // Need to test below for functionality
    // var db = firebase.database().ref();
    // var user = firebase.auth().currentUser;
    // var allUsers = db.child('users');

    // allUsers.child(user.uid).set({
    //   "email": user.email,
    //   "first_name": fName,
    //   "last_name": lName,
    //   "phone": phone,
    //   "address": address,
    //   "apartment_info": apartmentInfo,
    //   "city": city,
    //   "state": state
    // })
    // ---
	})
	.catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  
	  window.alert("Error : " + errorMessage);

		// ...
  
});
}

//Log user out and refresh page to diplay correct elements
function logout(){
  firebase.auth().signOut();
  location.replace("sign_in.html");
}

function verify_email(){
	var user = firebase.auth().currentUser;

user.sendEmailVerification().then(function() {
  // Email sent.
}).catch(function(error) {
  // An error happened.
});
}

function newaccount() {
	var pass1 = document.getElementById("inputPassword").value;
	var pass2 = document.getElementById("inputConfirmPassword").value;
	var good = true;
	if (pass1 != pass2) {
		alert("Passwords do not match");
		good = false;
	}
	else
	{
		create_account();
	}
	return good;
}
