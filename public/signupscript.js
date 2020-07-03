function signup() {
    var userName = document.getElementById("Username").value;
    var email = document.getElementById("Email").value;
    var password = document.getElementById("Password").value;
    var data = {userName, email, password};
    if(checkPassReqs(password) == false){
     return false;
	}
    if(checkUserReqs(userName, email) == false){
     return false;
	}
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch('/addUser', options);
    success();
}

async function logins(){
    var userName = document.getElementById("Username").value;
    var password = document.getElementById("Password").value;
    var data = {userName, password};
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var res =  await fetch('/authenticateUser', options);
    var data =  await res.json();

    // If no data was returned
    if(Object.keys(data).length != 1) {
        alert("fail");
    }
    else {
        success();
    }
    // if(auth(data, userName, password) == true){
    //     success();
	// }
    // else{
    //  return false;
	// }

}

// function auth(data, Username, password){
//     /*Alright, gonna be honest, no clue if this is efficient or not */
//     for(i of data){
//         if(i.userName == Username){
//             if(i.password == password){
//                 return true;
// 			}
//             else{
//                 alert("Your Password is Incorrect!");
//                 return false;
// 			}
// 		}
//     }
//     alert("This Username is Incorrect!")
//     return false;
// }

function success(){
     window.location.replace("dashboard.html");
}

function checkPassReqs(password) {
    var verifyPassword = /^[0-9a-zA-Z!@#$%^&*()]+$/;
    if(password.length < 6 || password.length > 25) {
        alert("Password must contain between 6 and 25 characters.");
        return false;
    }
    if(!verifyPassword.test(password)) {
        alert("Password must contain only numbers, letters, and common symbols (!@#$%^&*).");
        return false;
    }
    return true;
}

function checkUserReqs(userName, Email) {
    var alphanumeric = /^[0-9a-zA-Z]+$/;
    var verifyEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(userName.length < 4 || userName.length > 16) {
        alert("Username must be 4 to 16 characters long.");
        return false;
    }
    if(!alphanumeric.test(userName)) {
        alert("Username must contain only letters and numbers.");
        return false;
    }
    if(!verifyEmail.test(Email)) {
        alert("Invalid email address.");
        return false;
    }
    return true;
}
