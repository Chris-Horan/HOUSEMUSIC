async function addAdmin() {
    var statusBar = document.getElementById("adminMsg");
    var userName = document.getElementById("userName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
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
    await fetch('/addAdmin', options).then(function(res) {
        var stat = res.status;
        if(stat==201) {
            statusBar.innerHTML = "Username taken.";
        }
        else if(stat==202) {
            statusBar.innerHTML = "Email taken.";
        }
        else {
            statusBar.innerHTML = "Admin added successfully.";
        }
    });
}

async function changePw() {
    var userName = document.getElementById("userNamepw").value;
    var password = document.getElementById("passwordpw").value;
    var data = {userName, password};

    if(!checkPassReqs(password)) {
        return;
    }
    
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    await fetch('/changePassword', options).then(function(res) {
        if (res.status == 202) {
            document.getElementById("changeMsg").innerHTML = "User does not exist.";
        }
        else if (res.status == 201) {
            document.getElementById("changeMsg").innerHTML = "Password update failed.";
        }
        else {
            document.getElementById("changeMsg").innerHTML = "Password change successful.";
        }
    });
}

async function removeUser() {
    var userName = document.getElementById("userNamerem").value;
    var data = {userName};
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    await fetch('/removeUser', options).then(function(res) {
        if (res.status == 201) {
            document.getElementById("removeMsg").innerHTML = "User does not exist.";
        }
        else {
            document.getElementById("removeMsg").innerHTML = "User removed successfully.";
        }
    });
}

async function findUsers() {
    var userName = document.getElementById("userNameSearch").value;
    var alphanumeric = /^[0-9a-zA-Z]+$/;
    if((!alphanumeric.test(userName)) && userName.length != 0) {
        document.getElementById("searchMsg").innerHTML = "Invalid username query.";
        return;
    }
    var data = {userName};
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var res = await fetch('/findUsers', options);  //.then(function(res){        
    var data = await res.json();
    var tableFrame = document.getElementById("table");
    tableFrame.innerHTML = '';
    if(Object.keys(data).length===0) {
        document.getElementById("searchMsg").innerHTML = "No usernames containing this text.";
        return;
    }
    var table = document.createElement('table');
    tableFrame.append(table);
    var head = document.createElement('thead');
    table.append(head);
    var nameCol = document.createElement('th');
    nameCol.innerHTML = 'Username';
    var pwCol = document.createElement('th');
    pwCol.innerHTML = 'Password';
    var emailCol = document.createElement('th');
    emailCol.innerHTML = 'Email';
    var typeCol = document.createElement('th');
    typeCol.innerHTML = 'Type';
    head.append(nameCol, pwCol, emailCol, typeCol);
    for(p of data) {
        var row = document.createElement('tr');
        table.append(row);
        var nameCell = document.createElement('td');
        nameCell.innerHTML = p.userName;
        var pwCell = document.createElement('td');
        pwCell.innerHTML = p.password;
        var emailCell = document.createElement('td');
        emailCell.innerHTML = p.email;
        var typeCell = document.createElement('td');
        typeCell.innerHTML = p.userType;
        row.append(nameCell, pwCell, emailCell, typeCell);
    }
}

function checkPassReqs(password) {
    var statusBar = document.getElementById("adminMsg");
    var verifyPassword = /^[0-9a-zA-Z!@#$%^&*()]+$/;
    if(password.length < 6 || password.length > 25) {
        statusBar.innerHTML = "Password must be between 6 and 25 characters.";
        return false;
    }
    if(!verifyPassword.test(password)) {
        statusBar.innerHTML = "Password must contain only letters, numbers, and common symbols (!@#$%^&*).";
        return false;
    }
    return true;
}

function checkUserReqs(userName, Email) {
    var statusBar = document.getElementById("adminMsg");
    var alphanumeric = /^[0-9a-zA-Z]+$/;
    var verifyEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(userName.length < 4 || userName.length > 16) {
        statusBar.innerHTML = "Username must be between 4 and 16 characters.";
        return false;
    }
    if(!alphanumeric.test(userName)) {
        statusBar.innerHTML = "Username must contain only letters and numbers.";
        return false;
    }
    if(!verifyEmail.test(Email)) {
        statusBar.innerHTML = "Invalid email address.";
        return false;
    }
    return true;
}

function msgReset(){
    document.getElementById("adminMsg").innerHTML = "";
    document.getElementById("changeMsg").innerHTML = "";
    document.getElementById("searchMsg").innerHTML = "";
    document.getElementById("removeMsg").innerHTML = "";
}