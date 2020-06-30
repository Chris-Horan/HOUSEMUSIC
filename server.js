const express = require('express');
const app = express();
const DataStore = require('nedb');
const PORT = process.env.PORT || 5000;

// Set app to listen on localport 5000
// View locally running app at 127.0.0.1:5000
app.listen(PORT, function() {
    console.log('listening on port ', PORT);
});

// Attach database to app
const userData = new DataStore('userInfo.db');
userData.loadDatabase();

// Direct node to frontend resources folder (html, css, js)
app.use(express.static(__dirname + '/public'));

// Set max json request size
app.use(express.json({limit: '10kb'}));

// Set site root at /public/index.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// Ensure that userName and email are unique in the userInfo.db database
userData.ensureIndex({fieldName: 'userName', unique: true}, function(err){});
userData.ensureIndex({fieldName: 'email', unique: true}, function(err){});

// Handles the /addUser post request
app.post('/addUser', (req, res) => {
    console.log('Add user request.');
    if(checkUserReqs(req)) {
        userData.insert({userName: req.body.userName, password: req.body.password, email: req.body.email, userType: 'user'}, function(err) {
            if(err) {
                console.log("Add user failed.");
                console.log("Error: ", err.errorType);
                if(err.errorType === 'uniqueViolated') {
                    console.log("This username or email address already has an account associated with it.");
                }
            }
            else {
                console.log("Add user successful: ", req.body.userName);
            }
        });
    }
});

// Handles the /changePassword post request
app.post('/changePassword', (req, res) => {
    console.log('Change password request.');
    if(checkPassReqs(req.body.password)) {
        userData.update(
            {userName: req.body.userName},
            { $set: {password: req.body.password}}, function(err) {
                if(err) {
                    console.log("Password update failed.");
                }
                else {
                    console.log("Password update successful");
                }
            }
        );
        userData.persistence.compactDatafile();
    }
});

//Handles the /removeUser post request
app.post('/removeUser', (req, res) => {
    console.log('Remove user request.');
    userData.remove(
        {userName: req.body.userName}, function(err) {
            if(err) {
                console.log("Remove user failed.");
            }
            else {
                console.log("Remove user successful");
            }
        }
    );
    userData.persistence.compactDatafile();
});

// Ensures that 
function checkUserReqs(req) {
    var userName = req.body.userName;
    var password = req.body.password;
    var email = req.body.email;
    var alphanumeric = /^[0-9a-zA-Z]+$/;
    var verifyPassword = /^[0-9a-zA-Z!@#$%^&*()]+$/;
    var verifyEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(userName.length < 4 || userName.length > 16) {
        throw "Username must be 4 to 16 characters long.";
    }
    if(!alphanumeric.test(userName)) {
        throw "Username must contain only letters and numbers.";
    }
    if(password.length < 6 || password.length > 25) {
        throw "Password must contain between 6 and 25 characters.";
    }
    if(!verifyPassword.test(password)) {
        throw "Password must contain only numbers, letters, and common symbols (!@#$%^&*).";
    }
    if(!verifyEmail.test(email)) {
        throw "Invalid email address.";
    }
    return true;
}

function checkPassReqs(password) {
    var verifyPassword = /^[0-9a-zA-Z!@#$%^&*()]+$/;
    if(password.length < 6 || password.length > 25) {
        throw "Password must contain between 6 and 25 characters.";
    }
    if(!verifyPassword.test(password)) {
        throw "Password must contain only numbers, letters, and common symbols (!@#$%^&*).";
    }
    return true;
}

app.get('/all', (req, res) => {
    userData.find({}, (err, data) => {
        res.json(data);
    });
});