module.exports.test = {
    passReqsHandler: passReqsHandler,
    userReqsHandler: userReqsHandler
}

async function signup() {
    var userName = document.getElementById("Username").value;
    var email = document.getElementById("Email").value;
    var password = document.getElementById("Password").value;
    userName = userName.trim();
    email = email.trim();
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
            sessionStorage.setItem("name", userName);
            sessionStorage.setItem("type", 'user');
            userLogin();
        }
    });
}

function logout(){
    sessionStorage.setItem("type", null);
    sessionStorage.setItem("name", null);
    window.location.replace("index.html");
}

function loggedin(){
    if(sessionStorage.getItem("type") == 'admin'){
        document.getElementById('elementshield').style.display = 'block';
	}
    else if(sessionStorage.getItem("type") != 'user'){
     window.location.replace("login.html");
	}
    else{
     document.getElementById('elementshield').style.display = 'block';
	}
}

function allowlogin(){
    if(sessionStorage.getItem("type") != null && sessionStorage.getItem("type") != 'null'){
     document.getElementById("loginshield").style.display = 'none';
     window.location.replace("dashboard.html");
	}
    else{
     document.getElementById("loginshield").style.display = 'block';
	}
}

function allowsignup(){
    if(sessionStorage.getItem("type") != null && sessionStorage.getItem("type") != 'null'){
     document.getElementById("signupshield").style.display = 'none';
     window.location.replace("dashboard.html");
	}
    else{
     document.getElementById("signupshield").style.display = 'block';
	}
}
async function logins(){
    var userName = document.getElementById("Username").value;
    var password = document.getElementById("Password").value;
    userName = userName.trim();
    var data = {userName, password};
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var res = await fetch('/authenticateUser', options);
    if(res.status==201) {
        document.getElementById("PassErrorIncorrect").style.display="block"
    }
    else if(res.status==202) {
        document.getElementById("UserErrorExist").style.display="block"
    }
    else {
        var userInfo = await res.json();
        if(userInfo[0].userType==='user') {
            sessionStorage.setItem("name", userName);
            sessionStorage.setItem("type", 'user');
            userLogin();
        }
        else {
            sessionStorage.setItem("type", 'admin');
            sessionStorage.setItem("name", userName);
            // window.location.replace("login.html");
            adminLogin();
        }
    }
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

function resetReset() {
    document.getElementById("PassError").style.display="none";
    document.getElementById("PassError2").style.display="none";
    document.getElementById("tokenNotMatch").style.display="none";
    document.getElementById("NotMatch").style.display="none";
}

function userLogin(){
     window.location.replace("dashboard.html");
}

function adminLogin(){
    window.location.replace("adminPanel.html");
}

function checkPassReqs(password) {
    var retVal = passReqsHandler(password);
    if(retVal == 1) {
        document.getElementById("PassError").style.display="block"
        return false;
    }
    if(retVal == 2) {
        document.getElementById("PassError2").style.display="block"
        return false;
    }
    return true;
}

function passReqsHandler(password) {
    var verifyPassword = /^[0-9a-zA-Z!@#$%^&*()]+$/;
    if(password.length < 6 || password.length > 25) {
        return 1;
    }
    if(!verifyPassword.test(password)) {
        return 2;
    }
    return 0;
}

function checkUserReqs(userName, Email) {
    var retVal = userReqsHandler(userName, email);
    if(retVal==1) {
        document.getElementById("UserError2").style.display="block"
        return false;
    }
    if(retVal==2) {
        document.getElementById("UserError3").style.display="block"
        return false;
    }
    if(retVal==3) {
        document.getElementById("EmailError2").style.display="block"
        return false;
    }
    return true;
}

function userReqsHandler(userName, email) {
    var alphanumeric = /^[0-9a-zA-Z]+$/;
    var verifyEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(userName.length < 4 || userName.length > 16) {
        return 1;
    }
    if(!alphanumeric.test(userName)) {
        return 2;
    }
    if(!verifyEmail.test(email)) {
        return 3;
    }
    return 0;
}

async function forgotPass() {
    var email = document.getElementById("email").value;
    var data = {email};
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var res = await fetch('/forgot', options);
    var stat = res.status;
    if(stat==201) {
        document.getElementById("EmailNotFound").style.display="block"
    }
    else if(stat==202) {
        document.getElementById("NotFound").style.display="block"
    }
    else if(stat==200) {
        document.getElementById("Insert").style.display="block"
    }
}


async function resetPassword() {
    var url = window.location.href;
    var getToken = /([^\/]*)$/gm;
    var tok = url.match(getToken)[0];
    var password = document.getElementById("passw").value;
    var confirm = document.getElementById("confirm").value;
    if(!(checkPassReqs(password) && checkPassReqs("confirm"))) {
        return;
    }
    var data = {password,confirm, tok};
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var res = await fetch('/reset/:token', options);
    var stat = res.status;
    if(stat==201) {
        document.getElementById("tokenNotMatch").style.display="block"
    }
    else if(stat==202) {
        document.getElementById("NotMatch").style.display="block"
    }
    else if(stat==200) {
        document.getElementById("SuccessChanged").style.display="block";
        resetReset();

    }
}