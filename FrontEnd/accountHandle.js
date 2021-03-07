firebase.auth().onAuthStateChanged(function(user) {
  if (user != null) {
    // User is signed in. Show appropiate elements for signed in user and vice-versa.
    console.log("USER SIGNED IN");
    if (location.pathname.substring(location.pathname.lastIndexOf("/") + 1,location.pathname.lastIndexOf(".")) == "sign_in"){
      location.replace("index.html");
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

var child_counter = 0;

function showAddChild() {
    child_counter++;
    $("#add-child").addClass('d-none');
    $("#child-form1").removeClass('d-none');
    $("#grade").selectpicker('refresh');
    $("#subjects").selectpicker('refresh');
    $("#avatar").selectpicker('refresh');
    $("#addChildButton").removeClass('d-none');
    $("#remChildButton").removeClass('d-none');
}

function addChildForm() {
    child_counter++;

    var newChildForm = $("#child-form1").clone().find("input").val("").end();
    newChildForm.attr('id', 'child-form'+ child_counter);

    // rename IDs
    newChildForm.find("input").attr("id", "childName" + child_counter)
    var selectFields = newChildForm.find("select")
    for (var i = 0; i < selectFields.length; i++) {
            var fieldId = selectFields[i].id
            if (fieldId)
                $(selectFields[i]).attr('id', fieldId + child_counter)
    }
    newChildForm.appendTo("#child-placeholder")

    // reset select dropdowns
    newChildForm.find('.bootstrap-select').replaceWith(function() { return $('select', this); });
    newChildForm.find('ul').remove()
    $("#grade" + child_counter).selectpicker();
    $("#subjects" + child_counter).selectpicker();
    $("#avatar" + child_counter).imagepicker();
}

function delChildForm() {
  if (child_counter == 1){
    $("#addChildButton").addClass('d-none');
    $("#remChildButton").addClass('d-none');
    $("#add-child").removeClass("d-none");
    $("#child-form1").addClass('d-none');
  }
  else{
    $("#child-form"+child_counter).remove();
  }
  child_counter--;
  
}

function create_account_parent(basicInfo){
  var minSession = document.getElementById("minSession").value;
  var maxSession = document.getElementById("maxSession").value;
  var locPref = $('input[name="session_pref"]:checked').val();
  var backgroundCheck = $('input[name="background_check"]:checked').val();

  // compose child array
  var childData = []
  for (var i=1; i <= child_counter; i++) {
      if (i == 1) {
        var childName = document.getElementById("childName").value;
        var grade = document.getElementById("grade").value;
        var subjects = $('#subjects').val()
        var avatar = document.getElementById("avatar").value;
      } else {
        var childName = document.getElementById("childName" + i).value;
        var grade = document.getElementById("grade" + i).value;
        var subjects = $('#subjects' + i).val()
        var avatar = document.getElementById("avatar" + i).value;
      }

    childItem = {
        "child_name": childName,
        "grade": grade,
        "subjects": subjects,
        "avatar": avatar
    }
    childData.push(childItem)
  }

  console.log(childData)

	firebase.auth().createUserWithEmailAndPassword(basicInfo[0], basicInfo[1]).then(cred => {

    db.collection('users').doc(cred.user.uid).set({
      "user_type":"parent",
      "first_name": basicInfo[2],
      "last_name": basicInfo[3],
      "phone": basicInfo[4],
      "address": basicInfo[5],
      "apartment_info": basicInfo[6],
      "city": basicInfo[7],
      "state": basicInfo[8],
      "zipCode": basicInfo[9],
      "minSession": minSession,
      "maxSession": maxSession,
      "location_pref": locPref,
      "background_check": backgroundCheck,
      "children": childData
    })

		verify_email();
    setTimeout(() => {  logout(); }, 1000);
	})
	.catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  
	  window.alert("Error : " + errorMessage);

		// ...
  
});
}

function create_account_tutor(basicInfo){
  if ( $('input[name="grades"]:checked').length == 0){
    alert("Please select at least one grade level that you're interested in working with.");
    return false;
  }
  var minSession = document.getElementById("minSession").value;
  // var grades = $('#grade').val();
  var grades = [];
  $('input[name="grades"]:checked').each(function() { 
    grades.push(this.value); 
  });
  var subjects = $('#subjects').val()
  var bio = document.getElementById("bio").value;
  if ($('input[name="grades"]:checked').val() == "yes"){
    var locationPref = ["in_person","online"]
  }
  else{
    var locationPref = ["online"]
  }
 
  firebase.auth().createUserWithEmailAndPassword(basicInfo[0], basicInfo[1]).then(cred => {

    db.collection('users').doc(cred.user.uid).set({
      "user_type":"tutor",
      "first_name": basicInfo[2],
      "last_name": basicInfo[3],
      "phone": basicInfo[4],
      "address": basicInfo[5],
      "apartment_info": basicInfo[6],
      "city": basicInfo[7],
      "state": basicInfo[8],
      "zipCode": basicInfo[9],
      "minSession": minSession,
      "session_location": locationPref, 
      "grade": grades,
      "subjects": subjects,
      "bio": bio
    })
    // ---
    verify_email();
    setTimeout(() => {  logout(); }, 1000);
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

function newaccount(account_type) {
	var pass1 = document.getElementById("inputPassword").value;
	var pass2 = document.getElementById("inputConfirmPassword").value;
	var good = true;
	if (pass1 != pass2) {
		alert("Passwords do not match");
		good = false;
	}
	else
	{
    var userEmail = document.getElementById("email").value;
    var userPass = document.getElementById("inputPassword").value;
    var fname = document.getElementById("fname").value;
    var lname  = document.getElementById("lname").value;
    var phone = document.getElementById("phone").value;
    var address = document.getElementById("address").value;
    var city = document.getElementById("city").value;
    var apartmentInfo = document.getElementById("apartmentInfo").value;
    var state = document.getElementById("state").value;
    var zipCode = document.getElementById("zipCode").value;
    var basicInfo = [userEmail,userPass,fname,lname,phone,address,apartmentInfo,city,state,zipCode]
    if (account_type == "parent"){
      create_account_parent(basicInfo);
    }
    else{
      create_account_tutor(basicInfo);
    }
	}
	return false;
}
