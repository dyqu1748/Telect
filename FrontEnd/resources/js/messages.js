var uuid;
var response;
var convID = undefined;
var messageInd = 0;

firebase.auth().onAuthStateChanged(function(user) {
  if (user != null) {
    uuid = user.uid;
    db.collection('users').doc(uuid).get().then((doc)=>{
        getMatches(doc.data());
    })
  } else {
    console.log("No user signed in");
    location.replace("index.html");
  }
});

function getMatches(user) {
    if (user.user_type == "parent"){
        $.ajax({
            url: 'https://us-central1-telect-6026a.cloudfunctions.net/tutorMatches/' + uuid,
            success : function(data) {
                display_matches(data);
                response = data;
            }
        });
    }
    else{
        display_matches(user);
    }
	return true;
}

function display_matches(data) {
    if (data.user_type == 'tutor'){
        if (data.conversations !== undefined){
            var convRef = db.collection('conversations');
            data.conversations.forEach(function(conv){
                var curConv = convRef.doc(conv);
                curConv.get().then((doc)=>{
                    if (doc.data().users[0] == uuid){
                        var otherUserID = doc.data().users[1];
                    }
                    else{
                        var otherUserID= doc.data().users[0]
                    }
                    db.collection('users').doc(otherUserID).get().then((doc)=>{
                    var html = `
                    <div class="col mb-4">
                    <div class="card mx-auto border-secondary" style="width:22rem">
                        <div class="card-body text-center">
                            <h5 class="card-title">${doc.data().first_name} ${doc.data().last_name}</h5>
                            <a href='#' onclick="display_messages('tutor','${conv}')" class="btn btn-primary rounded-pill" >Send Message</a>
                        </div>
                    </div>
                    </div>
                    `;
                    $('#matched_users').append(html);
                    });
                })
            })
        }
        else{
            html+=`<h1>No New Messages</h1>`;
        }
    }
    else{
        for(i = 0; i < data.length; i++) {
            var tutorData = data[i];
            var html = `
            <div class="col mb-4">
            <div class="card mx-auto border-secondary" style="width:22rem">
                <img class="card-img-top" src="${tutorData.photoUrl}" alt="tutor-pic">
                <div class="card-body text-center">
                    <h5 class="card-title">${tutorData.first_name} ${tutorData.last_name}</h5>
                    <a href='#' onclick="display_messages('parent',${i})" class="btn btn-primary rounded-pill" >Send Message</a>
                </div>
            </div>
            </div>
            `;
            $('#matched_users').append(html);
        }
    }
	$('#loading_icon').fadeOut("fast");
	$('#matched_users').fadeIn();
	return true;
    //          <p id="selected_tutor" style="display: none;">${i}</p>
    //          <button onclick="session_details()">Request Session</button>
    //          </div>
 }

 function display_messages(userType, i){
    
    $('#matched_users').fadeOut('fast');
    var setup=`
    <div id= "disp_messages">

      </div>
    `;
    $('#message_area').prepend(setup);
    var messageHTML = `
        <div>
        <form id="message_form" onsubmit="return send_message('${userType}','${i}')">
        <div class="container form-group">
            <textarea class="form-control" id="message_body" rows="1" placeholder="Message" required></textarea>
            </div>
            <div class="form-group row justify-content-center">
            <div class="col-1">
                <button type="submit" class="btn btn-primary rounded-pill">Send Message</button>
            </div>
            <div class="col-1">
                <button class="btn btn-secondary rounded-pill" onclick="returnToMatches()">Go Back</button>
        </div>
        </form>
        </div>
        `;
    $('#message_area').append(messageHTML);
    if (userType == 'parent'){
        var selected_tutor = response[i];
        var dispName = `<h2 class="text-left">${selected_tutor.first_name} ${selected_tutor.last_name}</h2>`;
        $('#message_area').prepend(dispName);
        var user = firebase.auth().currentUser;
        db.collection('users').doc(user.uid).onSnapshot((doc)=> {
            var curUserConv = doc.data().conversations;

            if (curUserConv !== undefined){
                //Fill and display past messages

                var usersRef = db.collection("users");
                //Change this later to reference the user's email; right now not all users have their email written to the db
                usersRef.where("email", "==", selected_tutor.email)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((otherUserDoc) => {
                        var otherUserConv = otherUserDoc.data().conversations;
                        if (otherUserConv !== undefined){
                            //If conversation exists between two users

                            if (curUserConv.some(item => otherUserConv.includes(item))){
                                convID = curUserConv.filter(value => otherUserConv.includes(value))[0];
                                console.log(convID);
                                db.collection('conversations').doc(convID)
                                .onSnapshot((doc)=>{
                                    const reveal = async () => {
                                        const result = await write_messages_to_page(doc.data());
                                        $('#message_area').fadeIn('slow');
                                      }
                                    reveal();
                                })
                            
                            }
                        }
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
            }
        });
    }
    else{
        db.collection('conversations').doc(i)
        .onSnapshot((doc)=>{
            const reveal = async () => {
                const result = await write_messages_to_page(doc.data());
                $('#message_area').fadeIn('slow');
              }
            reveal();
        })
    }
 }

function write_messages_to_page(messageData){
    if (messageData.users[0] == uuid){
        var otherUserID = messageData.users[1];
    }
    else{
        var otherUserID= messageData.users[0]
    }
    db.collection('users').doc(otherUserID).get().then((otherUserDoc)=>{
        if (otherUserDoc.data().user_type == 'tutor'){
            var otherUserType = 'tutor';
            var curUserType = 'parent';
            var tutorPic = otherUserDoc.data().photoUrl;
        }
        else{
            var otherUserType = 'parent';
            var curUserType = 'tutor';
            var tutorPic = firebase.auth().currentUser.photoUrl;
        }
        var messages = ``;
        messageData.messages.forEach(function(messageData){
            if (messageData.userId == uuid){
                //Display message to the right
                messages+=`
                <div class="container chatbox darker ${curUserType}">
                    <p>${messageData.message}</p>
                </div>
                `; 
            }
            else{
                //Display message to the left
                messages+=`
                <div class="container chatbox ${otherUserType}">
                    <p>${messageData.message}</p>
                </div>
                `;

            }
            messageInd++;
        })
        $('#disp_messages').html(messages);
        if (curUserType == 'tutor'){
            var addTutorAvatar = `<img src="${tutorPic}" class="right" alt="tutor-pic">`;
            var addParentAvatar = `<div class="circle">
                                    <span class="initials">${otherUserDoc.data().first_name[0]}${otherUserDoc.data().last_name[0]}</span>
                                    </div>`;
            $("div[class$='parent']").prepend(addParentAvatar);
            $("div[class$='parent']").addClass('avatar-added');
        }
        else{
            var addTutorAvatar = `<img src="${tutorPic}" alt="tutor-pic">`;
            db.collection('users').doc(uuid).get().then((curUserDoc)=>{
                var addParentAvatar = `<div class="circle right">
                <span class="initials">${curUserDoc.data().first_name[0]}${curUserDoc.data().last_name[0]}</span>
                </div>`;
                $("div[class$='parent']").prepend(addParentAvatar);
                $("div[class$='parent']").addClass('avatar-added');
            })
        }
        $("div[class$='tutor']").prepend(addTutorAvatar);
        $("div[class$='tutor']").addClass('avatar-added');
        
        
    })
    
    
}


 function send_message(userType, i){
    var message_content=$('#message_body').val();
    var curMessage = {
        'userId': uuid,
        'message': message_content,
        'messageInd': messageInd
    };
    $('#message_body').val("");
     if (userType == 'parent'){
        var selected_tutor = response[parseInt(i)];
        var usersRef = db.collection("users");
        var currentUser = usersRef.doc(uuid);
        usersRef.where("email", "==", selected_tutor.email)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((otherUserDoc) => {

                if (convID !== undefined){
                    //If conversation exists between two users
                    db.collection('conversations').doc(convID).update({
                        'messages': firebase.firestore.FieldValue.arrayUnion(curMessage)
                    });
                }
                else{
                    db.collection('conversations').add({
                        'users':[uuid,otherUserDoc.id],
                        'messages': [curMessage]
                    })
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                        currentUser.update({
                            'conversations':firebase.firestore.FieldValue.arrayUnion(docRef.id)
                        });
                        usersRef.doc(otherUserDoc.id).update({
                            'conversations':firebase.firestore.FieldValue.arrayUnion(docRef.id)
                        });
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                }
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
     }
     else{
        db.collection('conversations').doc(i).update({
            'messages': firebase.firestore.FieldValue.arrayUnion(curMessage)
        });
     }
    return false
 }

function returnToMatches(){
    $('#message_area').fadeOut();
    $('#message_area').empty();

    $('#matched_users').fadeIn();
}