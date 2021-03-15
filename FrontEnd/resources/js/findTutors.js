var uuid;
firebase.auth().onAuthStateChanged(function(user) {
  if (user != null) {
    uuid = user.uid;
    getMatches()
  } else {
    console.log("USER NOT SIGNED IN");
  }
});

function getMatches() {
    $.ajax({
        url: 'https://us-central1-telect-6026a.cloudfunctions.net/tutorMatches/' + uuid,
        success : function(data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                var tutorData = data[i]
                const body = document.querySelector('body');
                var prev = $("#tutor-matches:last")

                var tutorCard = document.createElement('div');
                tutorCard.className = 'card w-75';
                var cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                var name = document.createElement('h5');
                name.className = 'card-title';
                name.innerHTML = tutorData.first_name + tutorData.last_name;
                var location = document.createElement('p');
                location.className = 'card-text';
                location.innerHTML = "Location: " + tutorData.city + ", " +tutorData.state;
                var hourlyRate = document.createElement('p');
                hourlyRate.className = 'card-text';
                hourlyRate.innerHTML = "Desired Hourly Rate: $" + tutorData.minSession;
                var subjects = document.createElement('p');
                subjects.className = 'card-text';
                subjects.innerHTML = "Subjects: " + tutorData.subjects;
                var bio = document.createElement('p');
                bio.className = 'card-text';
                bio.innerHTML = "About Me: " + tutorData.bio;
                var requestTutorBtn = document.createElement('a');
                requestTutorBtn.innerHTML = "Request Tutor";
                requestTutorBtn.className = 'btn btn-primary';
                requestTutorBtn.setAttribute('href', '#');

                var rowDiv = document.createElement('div');
                rowDiv.className = 'row';
                var colDiv = document.createElement('div');
                colDiv.className = 'col';
                var colDiv2 = document.createElement('div');
                colDiv2.className = 'col';

                var moreInfoLink = document.createElement('a');
                moreInfoLink.innerHTML = 'More Info'
                moreInfoLink.className = 'stretched-link';
                moreInfoLink.setAttribute('href', '#');

                prev.append(tutorCard);
                tutorCard.append(cardBody);
                cardBody.append(name);
                cardBody.append(rowDiv);
                rowDiv.append(colDiv);
                colDiv.append(requestTutorBtn);
                $('</br>').appendTo(colDiv)
                colDiv.append(moreInfoLink);
                rowDiv.append(colDiv2);
                colDiv2.append(location);
                colDiv2.append(hourlyRate);
                colDiv2.append(subjects);
                colDiv2.append(bio);
            }
        }
    });
}