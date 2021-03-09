$(document).ready(function() {
    if (document.title == "Telect - Account Register Review"){
        reviewInfo();
    }
    else{
        var account_type = sessionStorage.getItem("account_type");
        if (account_type == 'parent'){
            $('#tutorFields').remove();
        }
        else{
            $('#parentFields').remove();
        }
        if (JSON.parse(sessionStorage.getItem("basicInfo")) != null){
            reloadInfo();
        }
    }
    
});

function storeAccountType(account_type){
    sessionStorage.setItem("account_type", account_type);
    location.replace("register.html");
}

function reviewInfo(){
    var basicInfo = JSON.parse(sessionStorage.getItem("basicInfo"));
    var account_specific= JSON.parse(sessionStorage.getItem("account_specific"));
    for (let id in basicInfo){
        console.log(id);
        console.log(basicInfo[id]);
        if (basicInfo[id] == ""){
            $('#'+id).text("N/A");
        }
        else{
            $('#'+id).text(basicInfo[id])
        }
    }
    if (account_specific.accountType == "parent"){
        for (let id in account_specific){
            if (id != "childData"){
                $('#'+id+"Parent").text(account_specific[id]);
            }
        }
        var childData = account_specific['childData'];
        if (childData.length > 0){
            var allChildInfo = `<br><h3>Child Information</h3><br>`;
            childData.forEach(function(child,index){
                allChildInfo += `
                <div class="row">
                <div class="col-md-3">
                    <h3>Child ${index+1}</h3> 
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
                        <p class="lead">${child.grade}</p>
                </div> 
                </div>
                <div class="row">
                <div class ="col-md-3">
                    <h3>Subjects</h3> 
                </div>
                </div>
                <div class="row">
                    <div class="col">
                        <p class="lead">${child.subjects}</p>
                </div> 
                </div>
                <div class="row">
                <div class ="col-md-3">
                    <h3>Selected Avatar</h3> 
                </div>
                </div>
                <div class="row">
                    <div class="col">
                        <p class="lead">${child.avatar}</p>
                </div> 
                </div>`; 
                });
            console.log(allChildInfo);
            $('#parentInfo').append(allChildInfo);
        }
        $('#parentInfo').removeClass("d-none"); 
    }
    else{
        for (let id in account_specific){
            $('#'+id+"Tutor").text(account_specific[id]);
        }
        $('#tutorInfo').removeClass("d-none");
    }
}

function reloadInfo(){
    var basicInfo = JSON.parse(sessionStorage.getItem("basicInfo"));
    var account_specific = JSON.parse(sessionStorage.getItem("account_specific"));

    for (let id in basicInfo){
        $('#'+id).val(basicInfo[id])
    }
    console.log(account_specific);
    if (account_specific['accountType'] == 'parent'){
        for (let id in account_specific){
        if (id == 'background_check' || id == 'session_pref'){
            $('#'+id+"_"+account_specific[id]).click();
        }
        else{
            $('#'+id).val(account_specific[id])
        }
        }
        if (account_specific['childData'].length > 0){
        showAddChild();
        account_specific['childData'].forEach(function(child,index){
            if (index == 0){
            $('#childName').val(child.child_name);
            $('#grade').val(child.grade).change();
            $('#avatar').val(child.avatar);
            $('#subjects').val(child.subjects);
            $('#avatar').val(child.avatar).change();
            }
            else{
            console.log(index+1);
            addChildForm();
            $('#childName'+(index+1)).val(child.child_name);
            $('#grade'+(index+1)).val(child.grade).change();
            $('#avatar'+(index+1)).val(child.avatar);
            $('#subjects'+(index+1)).val(child.subjects);
            $('#avatar'+(index+1)).val(child.avatar).change();
            }
        });
        
        }
    }
    else{
        for (let id in account_specific){
        if (id == 'session_pref'){
            $('#'+id+"_"+account_specific[id]).click();
        }
        else if (id == 'grades'){
            account_specific[id].forEach(function(gradeLevel){
            $('#'+id+"_"+gradeLevel).click();
            });
        }
        else{
            $('#'+id).val(account_specific[id])
        }
        }
    }
    $('.selectpicker').selectpicker('refresh');
}

function redirect(){
    var account_specific= JSON.parse(sessionStorage.getItem("account_specific"));
    if (account_specific['accountType'] == 'parent'){
        location.replace("register_parent.html");
    }
    else{
        location.replace("register_tutor.html");
    }
}

function review_info(){
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
            'accountType':'tutor'
          }
        }
        sessionStorage.setItem("basicInfo", JSON.stringify(basicInfo));
        sessionStorage.setItem("account_specific", JSON.stringify(account_specific));
        location.replace('register_review.html');
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

function create_account(){
  var basicInfo = JSON.parse(sessionStorage.getItem("basicInfo"));
  var account_specific= JSON.parse(sessionStorage.getItem("account_specific"));

  firebase.auth().createUserWithEmailAndPassword(basicInfo['email'], basicInfo['inputPassword']).then(cred => {
    verify_email();
    db.collection('users').doc(cred.user.uid).set({
      "user_type":"tutor",
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
        "minSession": account_specific['minSession'],
        "maxSession": account_specific['maxSession'],
        "location_pref": account_specific['session_pref'], 
        "background_check": account_specific['background_check'],
        "children": account_specific['childData']
      })

    }
    else{
      return db.collection('users').doc(cred.user.uid).update({
        "minSession": account_specific['minSession'],
        "location_pref": account_specific['session_pref'], 
        "grade": account_specific['grades'],
        "subjects": account_specific['subjects'],
        "bio": account_specific['bio']
      })
    }
    // ---
  })
  .then(() => {
    sessionStorage.removeItem("basicInfo");
    sessionStorage.removeItem("account_specific");
    return logout();
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
    if (user != null) {
      first_name = user.first_name;
      email = user.email;
      document.getElementById("thanks_name").innerHTML += first_name + "."
      document.getElementById("verify_email").innerHTML += email + "."
    } else {
      console.log("user is null :(");
    }
  });
}