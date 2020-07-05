const express = require('express');
const path = require('path')
const app = express();
const DataStore = require('nedb');
const { response } = require('express');
const { nextTick } = require('process');
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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
app.post('/addUser', (req, res, next) => {
    console.log('Add user request.');
    userData.insert({userName: req.body.userName, password: req.body.password, email: req.body.email, userType: 'user'}, function(err) {
        if(err) {
            console.log("Add user failed.");
            console.log("Error: ", err.errorType);
            if(err.errorType === 'uniqueViolated') {
                var userNameCount = 0;
                userData.count({userName: req.body.userName}, function(err, count) {
                    userNameCount = count;
                    if(count!=0) {
                        console.log("Username taken.");
                        res.status(201);
                        res.send("Username taken.");
                    }
                });
                userData.count({email: req.body.email}, function(err, count) {
                    if(count!=0 && userNameCount==0) {
                        console.log("Email taken.");
                        res.status(202);
                        res.send("Email taken.");
                    }
                });
            }
        }
        else {
            console.log("Add user successful: ", req.body.userName);
            res.status(200);
            res.send("User added successfully");
        }
    });
});

// Handles user authentication
app.post('/authenticateUser', (req, res) => {
    console.log('User authentication request.');
    userData.count({userName: req.body.userName}, function(err, count) {
        if(count==1) {
            userData.find({userName: req.body.userName}, function(err, data) {
                if(data[0].password == req.body.password) {
                    console.log('Responded with user data.')
                    res.status(200);
                    res.json(data);
                }
                // Report error
                else {
                    console.log('Authentication failed');
                    res.status(201);
                    res.send("Incorrect password.")
                }
            });
        }
        // Report error
        else {
            console.log("User does not exist");
            res.status(202);
            res.send("User does not exist.");
        }
    });
    
});

// Handles the /changePassword post request
app.post('/changePassword', (req, res) => {
    console.log('Change password request.');
    userData.update(
        {userName: req.body.userName},
        { $set: {password: req.body.password}}, function(err) {
            // Report error
            if(err) {
                console.log("Password update failed.");
            }
            else {
                console.log("Password update successful");
            }
        }
    );
    userData.persistence.compactDatafile();
});

//Handles the /removeUser post request
app.post('/removeUser', (req, res) => {
    console.log('Remove user request.');
    userData.remove(
        {userName: req.body.userName}, function(err) {
            // Report error
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

// Sends all userData in a response
app.get('/all', (req, res) => {
    userData.find({}, (err, data) => {
        res.json(data);
    });
});