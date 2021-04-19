var uuid;
var response;
var convID = undefined;
var messageInd = 0;

firebase.auth().onAuthStateChanged(function(user) {
  // Check if there's a user signed in.
  if (user != null) {
    uuid = user.uid;
    //User found, fill page with users they can message
    db.collection('users').doc(uuid).get().then((doc)=>{
        getMatches(doc.data());
    })
  } else {
    //No user signed in, redirect to landing page.
    console.log("No user signed in");
    location.replace("index.html");
  }
});

function getMatches(user) {
    if (user.user_type == "parent"){
        //Display page with matched tutors parents can talk to
        $.ajax({
            url: 'https://us-central1-telect-6026a.cloudfunctions.net/tutorMatches/' + uuid,
            success : function(data) {
                display_matches(data);
                response = data;
            }
        });
    }
    else{
        //Display page with parents that the tutor can talk to
        display_matches(user);
    }
	return true;
}

function display_matches(data) {
    if (data.user_type == 'tutor'){
        //Check if user is part of any existing coversations
        if (data.conversations !== undefined){
            var convRef = db.collection('conversations');
            //Display parents the tutor has existing conversations with
            data.conversations.forEach(function(conv ,ind){
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
                    <div class="card mx-auto" id="${conv}" style="width:22rem">
                        <div class="card-body text-center">
                            <h5 class="card-title">${doc.data().first_name} ${doc.data().last_name}</h5>
                            <a href='#' onclick="display_messages('tutor','${conv}')" class="btn btn-primary rounded-pill" >Send Message</a>
                        </div>
                    </div>
                    </div>
                    `;
                    $('#matched_users').append(html);
                    //Check if user has any message notification. If so, add notification dot to that conversation.
                    if (jQuery.inArray(conv,data.notifications.messages) !== -1){
                            $('#'+conv).append('<span id="notif'+conv+'" class="dot"></span>');
                        }
                    })
                });
            })
            //Listen for new messages; notify user if new message comes
            db.collection('users').doc(uuid).onSnapshot((doc)=>{
                var curUserData = doc.data();
                //Add notifiaction dot to conversations with new messages
                curUserData.notifications.messages.forEach(function(conv){
                    $('#'+conv).append('<span id="notif'+conv+'" class="dot"></span>');
                })
            })    
        }
        else{
            //No conversations exist. 
            var html =`<h1 class='text-center'>No New Messages</h1>`;
            $('#matched_users').append(html);
        }
    }
    else{
        //Build and display tutors the parent is able to talk to 
        for(i = 0; i < data.length; i++) {
            var tutorData = data[i];
            var html = `
            <div class="col mb-4">
            <div class="card mx-auto" id="${i}" style="width:22rem">
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
        //Listen for new messages; notify user if new message comes
        db.collection('users').doc(uuid).onSnapshot((doc)=>{
            var curUserData = doc.data();
            //Add notifiaction dot to conversations with new messages
            data.forEach(function(tutorData,i){
                if (tutorData.conversations !== undefined && curUserData.notifications !== undefined){
                    if (tutorData.conversations.filter(value => curUserData.notifications.messages.includes(value)).length > 0){
                        $('#'+i).append('<span id="notif'+i+'" class="dot"></span>');
                    }
                }
            })
            
        })
    }
    //Fade in users area
	$('#loading_icon').fadeOut("fast");
	$('#matched_users').fadeIn();
	return true;
 }

 function display_messages(userType, i){
    //Fade our users area
    $('#matched_users').fadeOut('fast');
    var setup=`
    <div id= "disp_messages">

      </div>
    `;
    $('#message_area').prepend(setup);
    //Build and append message box to message area
    var messageHTML = `
        <div>
        <form id="message_form" onsubmit="return send_message('${userType}','${i}')">
        <div class="container form-group">
            <input class="form-control" id="message_body" placeholder="Message" autocomplete="off" required>
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
    var user = firebase.auth().currentUser;
    var userRef = db.collection('users').doc(user.uid);
    var otherUserRef = db.collection("users");
    if (userType == 'parent'){
        var selected_tutor = response[i];
        //Get current conversation info
        userRef.get().then((doc)=>{
            //Check if user has any message notifications
            if ($('#notif'+i).length > 0){
                var curUserData = doc.data();
                var curUserConv = curUserData.conversations;
                //Check if user has any notifications
                if (curUserData.notifications !== undefined){
                    if (curUserData.notifications.messages !== undefined){
                        otherUserRef.where("email", "==", selected_tutor.email)
                        .get()
                        .then((querySnapshot)=>{
                            querySnapshot.forEach((otherUserDoc)=>{
                                var otherUserConv = otherUserDoc.data().conversations;
                                //Check to see if conversation exists between the two users. If so, and there's a notification for it, remove notification.
                                if (otherUserConv !== undefined){
                                    if (curUserConv.some(item => otherUserConv.includes(item))){
                                        convID = curUserConv.filter(value => otherUserConv.includes(value))[0];
                                        userRef.update({
                                            "notifications.messages": firebase.firestore.FieldValue.arrayRemove(convID)
                                        })
                                        $('#notif'+i).remove();
                                    }
                                }
                            })
                        })
                        
                    }
                }
            }
        })
        //Build and display messages. Listen for new messages and display them as well.         
        userRef.onSnapshot((doc)=> {
            var curUserData = doc.data()
            var curUserConv = curUserData.conversations;
            //Check if the current user has any conversations.
            if (curUserConv !== undefined){
                //Fill and display past messages
                otherUserRef.where("email", "==", selected_tutor.email)
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
                                        //Write messages to the page. Fade in the message after it's written.
                                        const result = await write_messages_to_page(doc.data());
                                        $('#message_area').fadeIn('slow');
                                      }
                                    reveal();
                                })
                            
                            }
                        }
                    })
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
            }
        });
    }
    else{
        //Check if user has any message notifications
        userRef.get().then((doc)=>{
            var curUserData = doc.data();
            if (curUserData.notifications !== undefined){
                //Delete notification for current conversation if it exists
                if (curUserData.notifications.messages !== undefined){
                    userRef.update({
                        "notifications.messages": firebase.firestore.FieldValue.arrayRemove(i)
                    })
                    $('#notif'+i).remove();
                }
            }
        })
        //Build and display messages. Listen for new messages and display them as well.   
        db.collection('conversations').doc(i)
        .onSnapshot((doc)=>{
            const reveal = async () => {
                //Write messages to the page. Fade in the message after it's written.
                const result = await write_messages_to_page(doc.data());
                $('#message_area').fadeIn('slow');
              }
            reveal();
        })
        $('#message_area').fadeIn('slow');
    }
    $('#message_area').fadeIn('slow');
 }

function write_messages_to_page(messageData){
    //Set the other user's uid for proper display of their info
    if (messageData.users[0] == uuid){
        var otherUserID = messageData.users[1];
    }
    else{
        var otherUserID= messageData.users[0]
    }
    db.collection('users').doc(otherUserID).get().then((otherUserDoc)=>{
        //Set the user types for proper display of messages 
        if (otherUserDoc.data().user_type == 'tutor'){
            var otherUserType = 'tutor';
            var curUserType = 'parent';
            var tutorPic = otherUserDoc.data().photoUrl;
            
        }
        else{
            var otherUserType = 'parent';
            var curUserType = 'tutor';
        }

        //Add other user's name to top of page
        var messages = `<h2 class="text-left">${otherUserDoc.data().first_name} ${otherUserDoc.data().last_name}</h2>`;
        //Build and display all messages from the conversation
        messageData.messages.forEach(function(messageData){
            if (messageData.userId == uuid){
                //Display user's own messages to the right
                messages+=`
                <div class="container chatbox darker ${curUserType}">
                    <p class="message-content">${messageData.message}</p>
                </div>
                `; 
            }
            else{
                //Display other user's messages to the left
                messages+=`
                <div class="container chatbox ${otherUserType}">
                    <p class="message-content">${messageData.message}</p>
                </div>
                `;

            }
            messageInd++;
        })
        $('#disp_messages').html(messages);
        //Add parent initial icon and tutor profile pic to message box
        if (curUserType == 'tutor'){
            db.collection('users').doc(uuid).get().then((doc)=>{
                //If current user is a tutor, get their profile pic url to build icon.
                var tutorPic = doc.data().photoUrl;
                var addTutorAvatar = `<img src="${tutorPic}" class="right" alt="tutor-pic">`;
                var addParentAvatar = `<div class="circle">
                                        <span class="initials">${otherUserDoc.data().first_name[0]}${otherUserDoc.data().last_name[0]}</span>
                                        </div>`;
                //Add icons to message boxes
                $("div[class$='parent']").prepend(addParentAvatar);
                $("div[class$='parent']").addClass('avatar-added');
                $("div[class$='tutor']").prepend(addTutorAvatar);
                $("div[class$='tutor']").addClass('avatar-added');
            })
        }
        else{
            var addTutorAvatar = `<img src="${tutorPic}" alt="tutor-pic">`;
            db.collection('users').doc(uuid).get().then((curUserDoc)=>{
                //If current user is a parent, get their first and last name to build their icon.
                var addParentAvatar = `<div class="circle right">
                <span class="initials">${curUserDoc.data().first_name[0]}${curUserDoc.data().last_name[0]}</span>
                </div>`;
                //Add icons to message boxes
                $("div[class$='parent']").prepend(addParentAvatar);
                $("div[class$='parent']").addClass('avatar-added');
                $("div[class$='tutor']").prepend(addTutorAvatar);
                $("div[class$='tutor']").addClass('avatar-added');
            })
        }
        
    })
    
    
}


 function send_message(userType, i){
    var message_content=$('#message_body').val();
    //Package message into object containing message contents, message id, and message index.
    var curMessage = {
        'userId': uuid,
        'message': message_content,
        'messageInd': messageInd
    };
    //Empty the message box for the user's new message
    $('#message_body').val("");
     if (userType == 'parent'){
        var selected_tutor = response[parseInt(i)];
        var usersRef = db.collection("users");
        var currentUser = usersRef.doc(uuid);
        usersRef.where("email", "==", selected_tutor.email)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((otherUserDoc) => {
                //Check if conversation exists between the two users.
                if (convID !== undefined){
                    //If conversation exists between two users, update current conversation.
                    db.collection('conversations').doc(convID).update({
                        'messages': firebase.firestore.FieldValue.arrayUnion(curMessage)
                    });
                }
                else{
                    //Conversation does not exist. Add conversation to database.
                    db.collection('conversations').add({
                        'users':[uuid,otherUserDoc.id],
                        'messages': [curMessage]
                    })
                    .then((docRef) => {
                        //Write conversation id to parent's database document. Used when building and displaying messages.
                        console.log("Document written with ID: ", docRef.id);
                        currentUser.update({
                            'conversations':firebase.firestore.FieldValue.arrayUnion(docRef.id)
                        });
                        //Write conversation id to tutor's database document so that they can respond to the message.
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
    //Fade out message area, fade in users area.
    $('#message_area').fadeOut();
    $('#message_area').empty();

    $('#matched_users').fadeIn();
}