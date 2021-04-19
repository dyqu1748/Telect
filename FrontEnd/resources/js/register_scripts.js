var child_counter = 0;

// Dictionaries for use later to present information more nicely
var subject_keys = {'math':'Math','geometry':'Geometry','pre-algebra':'Pre-Algebra','algebra':'Algebra','science':'Science','geology':'Geology','chemistry':'Chemistry','social_studies':'Social Studies','govtHist': 'U.S. Government and History','language_arts':'Language Arts','spanish': 'Spanish'};
var location_keys = {'online':'Online','in_person':'In Person'};
var grade_keys = {'k':'Kindergarten', '1':'1st Grade', '2':'2nd Grade', '3':'3rd Grade', '4':'4th Grade', '5':'5th Grade', '6':'6th Grade', '7':'7th Grade', '8':'8th Grade'}; 

var password = document.getElementById("inputPassword")
, confirm_password = document.getElementById("inputConfirmPassword");

function validatePassword(){
  //Check if confirmation password is same as password. Report validity if invalid.
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
    confirm_password.reportValidity();
  } else {
    confirm_password.setCustomValidity('');
  }
}

//Check password validity when either password or confirm password changes
password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

// Make sure parent doesn't put lower max session value when compared to min session
$('#minSession').change(function(){
  var newMin = parseFloat($('#minSession').val());
  $('#maxSession').attr('min', newMin);
});

// Fade in account type choice div
$( document ).ready(function() {
  $("#account_choice").fadeIn("slow");
});

function storeAccountType(account_type){
    //Remove fields not correlated to chosen account type
    if (account_type == 'parent'){
        $('#tutorFields').remove();
    }
    else{
        $('#parentFields').remove();
    }
    //Set user's account type in session storage, will be used later to display proper elements
    sessionStorage.setItem("account_type", account_type);
    //Remove account choice div from display
    $("#account_choice").addClass("d-none");
    $('#inputConfirmPassword').tooltip({
      placement: "right",
      trigger: "focus"
     });
     $('#phone').tooltip({
      placement: "right",
      trigger: "focus"
     });
     //Display the register fields to user
    $('#register_fields').fadeIn();
}

function reviewInfo(){
    window.scrollTo(0, 0);
    var basicInfo = JSON.parse(sessionStorage.getItem("basicInfo"));
    var account_specific= JSON.parse(sessionStorage.getItem("account_specific"));

    //Fill in fields with user's entered info
    for (let id in basicInfo){
      if (id != 'schedule'){
        //If field had no input (optional field), display N/A
        if (basicInfo[id] == ""){
            $('#'+id+"Review").text("N/A");
        }
        else{
            $('#'+id+"Review").text(basicInfo[id]);
        }
      }
    }

    if (account_specific.accountType == "parent"){
        for (let id in account_specific){
            if (id != "childData"){
              //Modify how certain user-entered fields are displayed
              if (id == "session_pref"){
                $('#'+id+"Parent").text(location_keys[account_specific[id]]);
              }
              else if(id == "background_check"){
                $('#'+id+"Parent").text(account_specific[id].charAt(0).toUpperCase() + account_specific[id].slice(1));
              }
              else{
                if (id == 'minSession' || id == 'maxSession'){
                  $('#'+id+"Parent").text('$'+account_specific[id]);
                }
                //Display the rest of the fields as they are
                else{
                  $('#'+id+"Parent").text(account_specific[id]);
                }
              }  
            }
        }
        var childData = account_specific['childData'];
        //Build and display child information (if any exist)
        if (childData.length > 0){
            var allChildInfo = `<br><h2><u>Child Information</u></h2><br>`;
            childData.forEach(function(child,index){
                var all_subjects = "";
                //Build a string containing all of the student's subjects
                child.subjects.forEach(function(subject,subInd){
                  all_subjects+= subject_keys[subject];
                  if (subInd < child.subjects.length-1){
                    all_subjects+= ', ';
                  }
                });
                allChildInfo += `
                <div class="row">
                <div class="col-md-3">
                    <h2><u>Child ${index+1}</u></h2> 
                </div>
                </div>
                <div class="row">
                <div class="col-md-3">
                    <h3>Child Name</h3> 
                </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <p class="lead">${child.child_name}</p>
                    </div> 
                </div>
                <div class="row">
                <div class ="col-md-3">
                    <h3>Grade Level</h3> 
                </div>
                </div>
                <div class="row">
                    <div class="col">
                        <p class="lead">${grade_keys[child.grade]}</p>
                </div> 
                </div>
                <div class="row">
                <div class ="col-md-3">
                    <h3>Subjects</h3> 
                </div>
                </div>
                <div class="row">
                    <div class="col">
                        <p class="lead">${all_subjects}</p>
                </div> 
                </div>
                <div class="row">
                <div class ="col-md-3">
                    <h3>Selected Avatar</h3> 
                </div>
                </div>
                <div class="row">
                    <div class="col">
                        <img src="resources/img/child-${child.avatar}.png" style="width: 150px">
                </div> 
                </div>
                <br>`;
                });
            //Append children information to parent review area
            $('#parentInfo').append(allChildInfo);
        }
        //Reveal parent review information
        $('#parentInfo').removeClass("d-none"); 
    }
    else{
        for (let id in account_specific){
          //Modify how certain user-entered fields are displayed
          if (id == 'subjects'){
            var all_subjects = "";
            //Build a string containing all of the tutor's subject preferences
            account_specific[id].forEach(function(subject,ind){
              all_subjects+=subject_keys[subject];
              if (ind < account_specific[id].length-1){
                all_subjects+= ', ';
              }
            });
            $('#'+id+'Tutor').text(all_subjects);
          }
          else if (id == "session_pref"){
            var all_loc = "";
            //Build a string containing all of the tutor's location preferences
            account_specific[id].forEach(function(locat,ind){
              all_loc +=location_keys[locat];
              if (ind < account_specific[id].length-1){
                all_loc+=', '
              }
            });
            $('#'+id+'Tutor').text(all_loc);
          }
          else if (id == "grades"){
            var all_grades = "";
            //Build a string containing all of the tutor's grade preferences
            account_specific[id].forEach(function(grade,ind){
              all_grades+=grade_keys[grade];
              if (ind < account_specific[id].length-1){
                all_grades+= ', ';
              }
            })
            $('#'+id+'Tutor').text(all_grades);
          }
          //Display the rest of the fields as they are
          else{
            $('#'+id+"Tutor").text(account_specific[id]);
          }
        }
        $('#minSessionTutor').prepend('$');
        //Display the name of the tutor's resume file
        $('#resumeTutor').text($('#resume').prop('files')[0].name);
        var photo = $('#photo').prop('files')[0];
        //Display a thumbnail of the tutor's uploaded profile picture 
        if(photo){
          var reader = new FileReader();

          reader.onload = function(){
              $("#photoTutor").attr("src", reader.result);
          }

          reader.readAsDataURL(photo);
      }
        // Reveal the tutor's review info
        $('#tutorInfo').removeClass("d-none");
    }
    var url  = "https://us-central1-telect-6026a.cloudfunctions.net/availableLocations/" + basicInfo['state'] + "/" + basicInfo['city'];
    // Check if user is in an area that Telect supports. 
    const request = async (url) => {
      const response = await fetch(url);
      
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        alert(message);
        throw new Error(message);
      }

      const json = await response.json();
      console.log(json);
      if (json.success == false){
        // User does not live in an area supported by Telect. Inform user of the limitations.
        alert("Telect does not currently serve the area that you are currently in, so matching for in-person sessions will be unavailable. However, you may still make an account and we will inform you when Telect has begun supporting your current area.");
      }
    }

    request(url);
    //displayScheduleReview(basicInfo['schedule']);
}

function show_form(){
    //User wants to go back and edit their info. Fade out the review area, fade in the fields and go to the top of the page.
    $('#review_div').css('display','none');
    $('#register_fields').fadeIn();
    window.scrollTo(0, 0);
}

function display_review(){
    var account_type = sessionStorage.getItem("account_type");
    var userEmail = document.getElementById("email").value;
    //Check if user already exists
    firebase.auth().fetchSignInMethodsForEmail(userEmail)
    .then((signInMethods) => {
      if (signInMethods.length) {
        // The email already exists
        window.alert("An account with the provided email already exists.");
        return false;
      } else {
        // User does not exist. Save information to be displayed in review
        var userPass = document.getElementById("inputPassword").value;
        var fname = document.getElementById("fname").value;
        var lname  = document.getElementById("lname").value;
        var phone = document.getElementById("phone").value;
        var address = document.getElementById("address").value;
        var city = document.getElementById("city").value;
        var apartmentInfo = document.getElementById("apartmentInfo").value;
        var state = document.getElementById("state").value;
        var zipCode = document.getElementById("zipCode").value;
        var schedule = getScheduleDays();
        //Check if the user has selected at least one slot for their schedule
        if (checkScheduleReq(schedule[1]) == false){
          //User has not selected a slot. Scroll up to scheduler, inform user to select a slot.
          $([document.documentElement, document.body]).animate({
            scrollTop: $("#scheduler").offset().top-150
        }, 1000);
        window.alert("Please choose at least one slot for you availability.");  
          return false;
        }
        
        var basicInfo = {
          'email':userEmail,
          'inputPassword': userPass,
          'fname':fname,
          'lname':lname,
          'phone':phone,
          'address':address,
          'apartmentInfo':apartmentInfo,
          'city':city,
          'state':state,
          'zipCode':zipCode,
          'schedule': schedule[1]
        };
        // Save account specific information in another object
        if (account_type == "parent"){
          var minSession = document.getElementById("minSession").value;
          var maxSession = document.getElementById("maxSession").value;
          var session_pref = $('input[name="session_pref"]:checked').val();
          var background_check = $('input[name="background_check"]:checked').val();

          // compose child array with their respective information
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
          var account_specific = {
            'minSession': minSession,
            'maxSession': maxSession,
            'session_pref': session_pref,
            'background_check':background_check,
            'childData': childData,
            'accountType':'parent'
          }
        }
        else{
          // Check to see if tutor has selected at least 1 grade level preference. Inform them if they haven't.
          if ( $('input[name="grades"]:checked').length == 0){
            alert("Please select at least one grade level that you're interested in working with.");
            return false;
          }
          var minSession = document.getElementById("minSession").value;
          var grades = [];
          $('input[name="grades"]:checked').each(function() { 
            grades.push(this.value); 
          });
          var subjects = $('#subjects').val()
          var bio = document.getElementById("bio").value;
          //Check tutor's location preference. Build array that contains their choices.
          if ($('input[name="in_person_sessions"]:checked').val() == "yes"){
            var session_pref = ["in_person","online"]
          }
          else{
            var session_pref = ["online"]
          }
          var account_specific = {
            'minSession': minSession,
            'grades': grades,
            'subjects':subjects,
            'session_pref': session_pref,
            'bio':bio,
            'accountType':'tutor',
          }
        }
        //Save both general and account specific info to session storage for review display.
        sessionStorage.setItem("basicInfo", JSON.stringify(basicInfo));
        sessionStorage.setItem("account_specific", JSON.stringify(account_specific));
        //Fill in scheduler in review area
        displayScheduleReview(schedule[0]);
        //Fill out rest of user info on review area
        reviewInfo();
        //Fade in review area, fade out fields.
        $('#register_fields').css('display','none');
        $('#review_div').fadeIn();
        return false;
      }
    })
    .catch((error) => { 
      // Some error occurred.
      var errorMessage = error.message;
      
      window.alert("Error : " + errorMessage);
    });
    return false;
}

function showAddChild() {
    child_counter++;
    //Build and display child fields to user
    $("#add-child").addClass('d-none');

    var childHTML = `
    <br>
    <h3 id="child-form-header">Child ${child_counter}</h3>
    <h4>Add your child's full name (optional)</h4>
    <div class="form-group row">
    <div class="col-md-4">
    <input type ="text" id="childName" class="form-control" placeholder="Child's Full Name">
    </div>
    </div>
    <h4 class="header-control">Add your child's current grade level</h4>

    <div class="form-group row">
    <div class="col-md-3">
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
    </div>
    </div>

    <h4 class="header-control">Select the subjects your child needs help with</h4>

    <div class="form-group row">
    <div class="col-md-3">
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
    </div>
    </div>

    <h4 class="header-control">Choose an avatar for your child</h4>
    <div class="form-group row">
    <div class="col">
    <select id="avatar" class="image-picker show-html" required>
        <option data-img-src="resources/img/child-avatar1.png" value="avatar1">Avatar 1</option>
        <option data-img-src="resources/img/child-avatar2.png" value="avatar2">Avatar 2</option>
        <option data-img-src="resources/img/child-avatar3.png" value="avatar3">Avatar 3</option>
        <option data-img-src="resources/img/child-avatar4.png" value="avatar4">Avatar 4</option>
    </select>
    </div>
    </div>`;
    $("#child-form1").append(childHTML);
    //Refresh selectpicker and imagepicker so they display properly.
      $("#grade").selectpicker('refresh');
    $("#subjects").selectpicker('refresh');
    $("#avatar").imagepicker('refresh');
    // Reveal child fields to user
    $("#addChildButton").removeClass('d-none');
    $("#remChildButton").removeClass('d-none');
    $("#child-info-head").removeClass('d-none');
}

function addChildForm() {
    child_counter++;

    //Clone first child field div
    var newChildForm = $("#child-form1").clone().find("input").val("").end();
    newChildForm.prepend('<hr>');
    //Change id of cloned field for the new child
    newChildForm.attr('id', 'child-form'+ child_counter);
    //Label the new child for the user to see
    newChildForm.find("#child-form-header").html('Child '+child_counter);

    //Change ids of cloned input fields for the new child
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
  //If parent is deleting the first child form, empty the div and make it invisible. Make the add and remove child buttons invisible as well.
  if (child_counter == 1){
    $("#child-form1").empty();
    $("#add-child").removeClass('d-none');
    $("#addChildButton").addClass('d-none');
    $("#remChildButton").addClass('d-none');
    $("#child-info-head").addClass('d-none');
  }
  else{
    //Remove the newest child form
    $("#child-form"+child_counter).remove();
  }
  
  child_counter--;
  
}

function create_account(){
  //Display loading icon and blur out the page
  $('#loading_icon').fadeIn();
  $('#review_div').css('filter', 'blur(1.5rem)');
  $('#footer').css('filter', 'blur(1.5rem)');
  var basicInfo = JSON.parse(sessionStorage.getItem("basicInfo"));
  var account_specific= JSON.parse(sessionStorage.getItem("account_specific"));
  //Create account with provided email and password
  firebase.auth().createUserWithEmailAndPassword(basicInfo['email'], basicInfo['inputPassword']).then(cred => {
    var user = cred.user;
    //Set the user's profile name (only works for account with email attached to gmail)
    user.updateProfile({displayName: basicInfo['fname'] + ' ' + basicInfo['lname']});
    //Send verification email to user
    verify_email();
    //Write user's info to the database
    db.collection('users').doc(user.uid).set({
      "first_name": basicInfo['fname'],
      "last_name": basicInfo['lname'],
      "email": basicInfo['email'],
      "phone": basicInfo['phone'],
      "address": basicInfo['address'],
      "apartment_info": basicInfo['apartmentInfo'],
      "city": basicInfo['city'],
      "state": basicInfo['state'],
      "zipCode": basicInfo['zipCode'],
      "schedule": basicInfo['schedule']
    })

    if (account_specific['accountType'] == 'parent'){
      return db.collection('users').doc(user.uid).update({
        "user_type":"parent",
        "minSession": account_specific['minSession'],
        "maxSession": account_specific['maxSession'],
        "location_pref": account_specific['session_pref'], 
        "background_check": account_specific['background_check'],
        "children": account_specific['childData']
      })

    }
    else{
      //Get the resume and profile picture file for upload to Firebase
      var resumeFile = $('#resume').prop('files')[0];
      var profilePic = $('#photo').prop('files')[0];
      var storageRef = firebase.storage().ref();
      //Rename the files to the user's uid.
      var picName = 'profilePictures/'+user.uid +'.'+profilePic.name.split('.').pop();
      var resumeName = 'resumes/'+user.uid+'.'+resumeFile.name.split('.').pop();
      //Upload files to Firebase
      var resumeRef = storageRef.child(resumeName);
      var picRef = storageRef.child(picName);
      const userCollectionRef = db.collection('users').doc(cred.user.uid);
      return resumeRef.put(resumeFile,resumeFile.type).then((snapshot) =>{
        console.log("Uploaded resume!");
      })
      .then(() => {
        return picRef.put(profilePic,profilePic.type).then((snapshot) =>{
          console.log("Uploaded profile pic!");
        });
      }).then(()=>{
        var store = firebase.storage();
        return store.ref(picName).getDownloadURL().then((url)=>{
          //Save user's profile picture to their account (only works for gmail accounts)
          return user.updateProfile({photoURL: url});
        });
      })
      .then(() =>{
        //Save account specific info to database
        return db.collection('users').doc(cred.user.uid).update({
          "user_type":"tutor",
          "minSession": account_specific['minSession'],
          "location_pref": account_specific['session_pref'], 
          "grade": account_specific['grades'],
          "subjects": account_specific['subjects'],
          "bio": account_specific['bio']
        });
      }).then(() =>{
        //Save file urls to user's database document as well for display later
        return storageRef.child(picName).getDownloadURL().then((url) =>{
            return userCollectionRef.update({"photoUrl": url})});
      }).then(() => {
        return storageRef.child(resumeName).getDownloadURL().then((url) => {
            return userCollectionRef.update({"resumeUrl": url})});
      })
    }
    // ---
  })
  .then(() => {
    //Remove user info from session storage
    sessionStorage.removeItem("basicInfo");
    sessionStorage.removeItem("account_specific");
    //Redirect user to verify email page.
    location.replace("verify_email.html");
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    
    window.alert("Error : " + errorMessage);

    // ...
  
});

}

function get_username_and_email() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("User found");
      var user = firebase.auth().currentUser;
      console.log(user.uid);
  
    db.collection('users').doc(user.uid).onSnapshot((doc)=> {
      data = doc.data();
      console.log("all data", data);
      console.log("first_name", data.first_name);
      //Display appropriate info on page
      document.getElementById("thanks_name").innerHTML += data.first_name + ".";
      document.getElementById("verify_email").innerHTML += user.email + ".";
      //Sign user out so they aren't redirected to home dashboard
      firebase.auth().signOut();
    });
    } else {
      console.log("No user signed in");
    }
  });
  
}