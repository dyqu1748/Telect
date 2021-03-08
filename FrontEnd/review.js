window.onload = function() {
    var basicInfo = JSON.parse(sessionStorage.getItem("basicInfo"));
    var account_specific= JSON.parse(sessionStorage.getItem("account_specific"));
    console.log(basicInfo);
    console.log(account_specific);
    var childData = account_specific[4];
    var basicInfoIds = ['email','inputPassword','fname','lname','phone','address','apartmentInfo','city','state','zipCode'];
    basicInfoIds.forEach(function(item, index){
        console.log(item);
        console.log(basicInfo[index]);
        if (item == ""){
            $('#'+item).text("N/A");
        }
        else{
            $('#'+item).text(basicInfo[index]);
        }
        
    });
    var appendHTML =  `
<br>
<h3>Session Preferences</h3>
<br>
<div class="row">
  <div class="col-md-3">
    <h3>Minimum Session Rate</h3>
</div>
<div class="col-md-3">
    <h3>Maximum Session Rate</h3>
</div> 
</div>
<div class="row">
  <div class="col-md-3">
  <p class="lead">$${account_specific[0]}</p>
</div>
 <div class="col-md-3">
    <p class="lead">$${account_specific[1]}</p>
 </div>
</div>
<div class="row">
<div class="col-md-3">
    <h3>Session Location Preference</h3> 
</div>
</div>
<div class="row">
 <div class="col-md-3">
     <p class="lead">${account_specific[2]}</p>
 </div> 
</div>
<div class="row">
<div class ="col-md-3">
    <h3>Prefer Background Checked Tutors</h3> 
</div>
</div>
<div class="row">
 <div class="col">
     <p class="lead">${account_specific[3]}</p>
</div> 
</div>
  `;
  var allChildInfo = `<br><h3>Child Information</h3><br>`;
  childData.forEach(function(child,index){
    allChildInfo += `
    <div class="row">
    <div class="col-md-3">
        <h3>Child ${index}</h3> 
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
    appendHTML+=allChildInfo;
  $('#infoPlaceholder').append(appendHTML);
    // Use the code below to delete user info from session after account creationS
    // storage.removeItem(keyName);
};