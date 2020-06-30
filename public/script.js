window.onload= function() {
    buildTable();
}

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

async function buildTable() {
    var tableFrame = document.getElementById("table");
    var res = await fetch('/all');
    var data = await res.json();
    tableFrame.innerHTML = '';
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