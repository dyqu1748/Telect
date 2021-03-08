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

    var childHTML = `<h3>Add your child's full name (optional)</h3>
    <input type ="text" id="childName" class="form-control" placeholder="Child's Full Name">
    <h3 class="header-control">Add your child's current grade level</h3>

    <select id="grade" title="Select Grade Level" required>
        <option value="k">Kindergarten</option>
        <option value="1">1st Grade</option>
        <option value="2">2nd Grade</option>
        <option value="3">3rd Grade</option>
        <option value="4">4th Grade</option>
        <option value="5">5th Grade</option>
        <option value="6">6th Grade</option>
        <option value="7">7th Grade</option>
        <option value="8">8th Grade</option>
    </select>

    <h3 class="header-control">Select the subjects your child needs help with</h3>

    <select class="selectpicker" id ='subjects' data-live-search="true" multiple title="Select Subjects" required>
        <option value="math">Math</option>
        <option value="geometry">Geometry</option>
        <option value="pre-algebra">Pre-algebra</option>
        <option value="algebra">Algebra</option>
        <option value="science">Science</option>
        <option value="geology">Geology</option>
        <option value="chemistry">Chemistry</option>
        <option value="social_studies">Social Studies</option>
        <option value="govtHist">U.S. Government and History</option>
        <option value="language_arts">Language Arts</option>
        <option value="spanish">Spanish</option>
    </select>

    <h3 class="header-control">Choose an avatar for your child</h3>
    <select id="avatar" class="image-picker show-html" required>
        <option data-img-src="https://c-sf.smule.com/rs-s23/arr/d6/75/227c4be5-3914-427b-91be-eac339869d70_1024.jpg" value="avatar1">Avatar 1</option>
        <option data-img-src="https://static.zerochan.net/Dango.%28CLANNAD%29.full.113867.jpg" value="avatar2">Avatar 2</option>
        <option data-img-src="https://static.zerochan.net/Dango.%28CLANNAD%29.full.113865.jpg" value="avatar3">Avatar 3</option>
    </select>`;
    $("#child-form1").append(childHTML);
      $("#grade").selectpicker('refresh');
    $("#subjects").selectpicker('refresh');
    $("#avatar").imagepicker('refresh');
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
    var basicInfo = [userEmail,userPass,fname,lname,phone,address,apartmentInfo,city,state,zipCode];
    if (account_type == "parent"){
      create_account_parent(basicInfo);
    }
    else{
      create_account_tutor(basicInfo);
    }
	}
	return false;
}

function review_info(){
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
    var basicInfo = [userEmail,userPass,fname,lname,phone,address,apartmentInfo,city,state,zipCode];

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
    var account_specific = [minSession,maxSession,locPref,backgroundCheck, childData];
    sessionStorage.setItem("basicInfo", JSON.stringify(basicInfo));
    sessionStorage.setItem("account_specific", JSON.stringify(account_specific));
    location.replace('register_review.html');
    return false;
}

window.onload = function() {
  var basicInfo = JSON.parse(sessionStorage.getItem("basicInfo"));
  console.log(basicInfo);
  var basicInfoIds = ['email','inputPassword','fname','lname','phone','address','apartmentInfo','city','state','zipCode'];
  basicInfoIds.forEach(function(item, index){
      console.log(item);
      console.log(basicInfo[index]);
      $('#'+item).val(basicInfo[index]);
      $('.selectpicker').selectpicker('refresh');
  });
  
};
