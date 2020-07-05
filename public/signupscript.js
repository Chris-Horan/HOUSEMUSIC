async function signup() {
    var userName = document.getElementById("Username").value;
    var email = document.getElementById("Email").value;
    var password = document.getElementById("Password").value;
    var data = {userName, email, password};
    if(!checkPassReqs(password)) {
        return;
        // Change HTML to reflect that password does not meet reqs
	}
    if(!checkUserReqs(userName, email)) {
        return;
        // Change HTML to reflect that username does not meet reqs
	}
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    await fetch('/addUser', options).then(function(res) {
        var stat = res.status;
        if(stat==201) {
            // Change HTML to reflect that username is taken
            //alert("Username taken.");
            document.getElementById("UserError").style.display="block"
        }
        else if(stat==202) {
            // Change HTML to reflect that email is taken
            //alert("Email taken.");
            document.getElementById("EmailError").style.display="block"
        }
        else {
            success();
        }
    });
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
    await fetch('/authenticateUser', options).then(function(res) {
        var stat = res.status;
        if(res.status==201) {
            // Change HTML to reflect that password is incorrect
            //alert("Incorrect password.");
            document.getElementById("PassErrorIncorrect").style.display="block"
        }
        else if(res.status==202) {
            // Change HTML to reflect that username does not exists
            //alert("Username does not exist.");
            document.getElementById("UserErrorExist").style.display="block"
        }
        else {
            success();
        }
    });
}

function signupreset(){
    document.getElementById("UserError").style.display="none";
    document.getElementById("EmailError").style.display="none";
    document.getElementById("PassError").style.display="none";
    document.getElementById("PassError2").style.display="none";
    document.getElementById("UserError2").style.display="none";
    document.getElementById("UserError3").style.display="none";
    document.getElementById("EmailError2").style.display="none";
}

function loginreset(){
    document.getElementById("PassErrorIncorrect").style.display="none";
    document.getElementById("UserErrorExist").style.display="none";
}

function success(){
     window.location.replace("dashboard.html");
}

function checkPassReqs(password) {
    var verifyPassword = /^[0-9a-zA-Z!@#$%^&*()]+$/;
    if(password.length < 6 || password.length > 25) {
        //alert("Password must contain between 6 and 25 characters.");
        document.getElementById("PassError").style.display="block"
        return false;
    }
    if(!verifyPassword.test(password)) {
        //alert("Password must contain only numbers, letters, and common symbols (!@#$%^&*).");
        document.getElementById("PassError2").style.display="block"
        return false;
    }
    return true;
}

function checkUserReqs(userName, Email) {
    var alphanumeric = /^[0-9a-zA-Z]+$/;
    var verifyEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(userName.length < 4 || userName.length > 16) {
        //alert("Username must be 4 to 16 characters long.");
        document.getElementById("UserError2").style.display="block"
        return false;
    }
    if(!alphanumeric.test(userName)) {
        //alert("Username must contain only letters and numbers.");
        document.getElementById("UserError3").style.display="block"
        return false;
    }
    if(!verifyEmail.test(Email)) {
        //alert("Invalid email address.");
        document.getElementById("EmailError2").style.display="block"
        return false;
    }
    return true;
}
