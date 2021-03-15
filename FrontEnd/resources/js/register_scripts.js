var child_counter = 0;

var subject_keys = {'math':'Math','geometry':'Geometry','pre-algebra':'Pre-Algebra','algebra':'Algebra','science':'Science','geology':'Geology','chemistry':'Chemistry','social_studies':'Social Studies','govtHist': 'U.S. Government and History','language_arts':'Language Arts','spanish': 'Spanish'};
var location_keys = {'online':'Online','in_person':'In Person'};
var grade_keys = {'k':'Kindergarten', '1':'1st Grade', '2':'2nd Grade', '3':'3rd Grade', '4':'4th Grade', '5':'5th Grade', '6':'6th Grade', '7':'7th Grade', '8':'8th Grade'}; 
// Make sure parent doesn't put lower max session value when compared to min session
$('#minSession').change(function(){
  var newMin = parseFloat($('#minSession').val())+0.01;
  $('#maxSession').attr('min', newMin);
});

$( document ).ready(function() {
  $("#account_choice").fadeIn("slow");
});

function storeAccountType(account_type){
    if (account_type == 'parent'){
        $('#tutorFields').remove();
    }
    else{
        $('#parentFields').remove();
    }
    sessionStorage.setItem("account_type", account_type);
    $("#account_choice").addClass("d-none");
    $('#register_fields').fadeIn();
}

function reviewInfo(){
    window.scrollTo(0, 0);
    var basicInfo = JSON.parse(sessionStorage.getItem("basicInfo"));
    var account_specific= JSON.parse(sessionStorage.getItem("account_specific"));
    // console.log(account_specific);

    for (let id in basicInfo){
        if (basicInfo[id] == ""){
            $('#'+id+"Review").text("N/A");
        }
        else{
            $('#'+id+"Review").text(basicInfo[id])
        }
    }
    if (account_specific.accountType == "parent"){
        for (let id in account_specific){
            if (id != "childData"){
              if (id == "session_pref"){
                $('#'+id+"Parent").text(location_keys[account_specific[id]]);
              }
              else if(id == "background_check"){
                if (account_specific[id] == 'no'){
                  $('#'+id+"Parent").text('No');
                }
                else{
                  $('#'+id+"Parent").text('Yes');
                }
              }
              else{
                $('#'+id+"Parent").text(account_specific[id]);
              }
                
            }
        }
        var childData = account_specific['childData'];
        if (childData.length > 0){
            var allChildInfo = `<br><h2><u>Child Information</u></h2><br>`;
            childData.forEach(function(child,index){
                var all_subjects = "";
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
                        <img src="resources/img/child-${child.avatar}.png" style="width: 10%">
                </div> 
                </div>
                <br>`;
                for (let subject in child.subjects){
                  $('#subjectsReview').append(subject_keys[subject]);
                }
                });
            $('#parentInfo').append(allChildInfo);
        }
        $('#parentInfo').removeClass("d-none"); 
    }
    else{
        for (let id in account_specific){
          if (id == 'subjects'){
            var all_subjects = "";
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
            account_specific[id].forEach(function(grade,ind){
              all_grades+=grade_keys[grade];
              if (ind < account_specific[id].length-1){
                all_grades+= ', ';
              }
            })
            $('#'+id+'Tutor').text(all_grades);
          }
          else{
            $('#'+id+"Tutor").text(account_specific[id]);
          }
        }
        $('#resumeTutor').text($('#resume').prop('files')[0].name);
        var photo = $('#photo').prop('files')[0];
        if(photo){
          var reader = new FileReader();

          reader.onload = function(){
              $("#photoTutor").attr("src", reader.result);
          }

          reader.readAsDataURL(photo);
      }
        $('#tutorInfo').removeClass("d-none");
    }
    var url  = "https://us-central1-telect-6026a.cloudfunctions.net/availableLocations/" + basicInfo['state'] + "/" + basicInfo['city'];
    const request = async (url) => {
      const response = await fetch(url);
      
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const json = await response.json();
      console.log(json);
      if (json.success == false){
        alert("Telect does not currently serve the area that you are currently in, so matching for in-person sessions will be unavailable. However, you may still make an account and we will inform you when Telect has begun supporting your current area.");
      }
    }
    
    request(url);
}

function show_form(){
    $('#review_div').css('display','none');
    $('#register_fields').fadeIn();
    window.scrollTo(0, 0);
}

function display_review(){
    var account_type = sessionStorage.getItem("account_type");
    var userEmail = document.getElementById("email").value;
    firebase.auth().fetchSignInMethodsForEmail(userEmail)
    .then((signInMethods) => {
      if (signInMethods.length) {
        // The email already exists
        window.alert("An account with the provided email already exists.");
        return false;
      } else {
        // User does not exist. Ask user to sign up.
        var userPass = document.getElementById("inputPassword").value;
        var fname = document.getElementById("fname").value;
        var lname  = document.getElementById("lname").value;
        var phone = document.getElementById("phone").value;
        var address = document.getElementById("address").value;
        var city = document.getElementById("city").value;
        var apartmentInfo = document.getElementById("apartmentInfo").value;
        var state = document.getElementById("state").value;
        var zipCode = document.getElementById("zipCode").value;
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
          'zipCode':zipCode
        };
        if (account_type == "parent"){
          var minSession = document.getElementById("minSession").value;
          var maxSession = document.getElementById("maxSession").value;
          var session_pref = $('input[name="session_pref"]:checked').val();
          var background_check = $('input[name="background_check"]:checked').val();

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
        sessionStorage.setItem("basicInfo", JSON.stringify(basicInfo));
        sessionStorage.setItem("account_specific", JSON.stringify(account_specific));
        // location.replace('register_review.html');
        reviewInfo();
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
        <option data-img-src="resources/img/child-avatar1.png" value="avatar1">Avatar 1</option>
        <option data-img-src="resources/img/child-avatar2.png" value="avatar2">Avatar 2</option>
        <option data-img-src="resources/img/child-avatar3.png" value="avatar3">Avatar 3</option>
        <option data-img-src="resources/img/child-avatar4.png" value="avatar4">Avatar 4</option>
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
  $("#child-form"+child_counter).remove();
  child_counter--;
}

function create_account(){
  $('#loading_icon').fadeIn();
  $('#review_div').css('filter', 'blur(1.5rem)');
  var basicInfo = JSON.parse(sessionStorage.getItem("basicInfo"));
  var account_specific= JSON.parse(sessionStorage.getItem("account_specific"));
  firebase.auth().createUserWithEmailAndPassword(basicInfo['email'], basicInfo['inputPassword']).then(cred => {
    verify_email();
    db.collection('users').doc(cred.user.uid).set({
      'email':basicInfo['email'],
      "first_name": basicInfo['fname'],
      "last_name": basicInfo['lname'],
      "phone": basicInfo['phone'],
      "address": basicInfo['address'],
      "apartment_info": basicInfo['apartmentInfo'],
      "city": basicInfo['city'],
      "state": basicInfo['state'],
      "zipCode": basicInfo['zipCode']
    })

    if (account_specific['accountType'] == 'parent'){
      return db.collection('users').doc(cred.user.uid).update({
        "user_type":"parent",
        "minSession": account_specific['minSession'],
        "maxSession": account_specific['maxSession'],
        "location_pref": account_specific['session_pref'], 
        "background_check": account_specific['background_check'],
        "children": account_specific['childData']
      })

    }
    else{
      var resumeFile = $('#resume').prop('files')[0];
      var profilePic = $('#photo').prop('files')[0];
      var storageRef = firebase.storage().ref();
      var resumeRef = storageRef.child(cred.user.uid+'/'+resumeFile.name);
      var picRef = storageRef.child(cred.user.uid+'/'+profilePic.name);
      return resumeRef.put(resumeFile,resumeFile.type).then((snapshot) =>{
        console.log("Uploaded resume!");
      })
      .then(() => {
        return picRef.put(profilePic,profilePic.type).then((snapshot) =>{
          console.log("Uploaded profile pic!");
        });
      }).then(() =>{
        return db.collection('users').doc(cred.user.uid).update({
          "user_type":"tutor",
          "minSession": account_specific['minSession'],
          "location_pref": account_specific['session_pref'], 
          "grade": account_specific['grades'],
          "subjects": account_specific['subjects'],
          "bio": account_specific['bio']
        });
      })
    }
    // ---
  })
  .then(() => {
    sessionStorage.removeItem("basicInfo");
    sessionStorage.removeItem("account_specific");
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
      document.getElementById("thanks_name").innerHTML += data.first_name + "."
      document.getElementById("verify_email").innerHTML += user.email + "."
    });
    } else {
      console.log("No user signed in");
    }
  });
  
}