async function signup() {
    var userName = document.getElementById("Username").value;
    var email = document.getElementById("Email").value;
    var password = document.getElementById("Password").value;
    var data = {userName, email, password};
    if(!checkPassReqs(password)) {
        return;
	}
    if(!checkUserReqs(userName, email)) {
        return;
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
            document.getElementById("UserError").style.display="block"
        }
        else if(stat==202) {
            document.getElementById("EmailError").style.display="block"
        }
        else {
            userLogin();
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
        if(res.status==201) {
            document.getElementById("PassErrorIncorrect").style.display="block"
        }
        else if(res.status==202) {
            document.getElementById("UserErrorExist").style.display="block"
        }
        else {
            var userInfo = res.json();
            for(p of userInfo) {
                alert(userInfo.userType);
                if(userInfo.userType==='user') {
                    userLogin();
                }
                else {
                    window.location.replace("adminPanel.html");
                }
            }
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

function userLogin(){
     window.location.replace("dashboard.html");
}

function checkPassReqs(password) {
    var verifyPassword = /^[0-9a-zA-Z!@#$%^&*()]+$/;
    if(password.length < 6 || password.length > 25) {
        document.getElementById("PassError").style.display="block"
        return false;
    }
    if(!verifyPassword.test(password)) {
        document.getElementById("PassError2").style.display="block"
        return false;
    }
    return true;
}

function checkUserReqs(userName, Email) {
    var alphanumeric = /^[0-9a-zA-Z]+$/;
    var verifyEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(userName.length < 4 || userName.length > 16) {
        document.getElementById("UserError2").style.display="block"
        return false;
    }
    if(!alphanumeric.test(userName)) {
        document.getElementById("UserError3").style.display="block"
        return false;
    }
    if(!verifyEmail.test(Email)) {
        document.getElementById("EmailError2").style.display="block"
        return false;
    }
    return true;
}
