function addUser() {
    var userName = document.getElementById("userName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var data = {userName, email, password};
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch('/addUser', options);
}

function changePw() {
    var userName = document.getElementById("userNamepw").value;
    var password = document.getElementById("passwordpw").value;
    var data = {userName, password};
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch('/changePassword', options);
}

function removeUser() {
    var userName = document.getElementById("userNamerem").value;
    var data = {userName};
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch('/removeUser', options);
}