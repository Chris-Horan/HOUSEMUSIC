const express = require('express');
const path = require('path')
const app = express();
// const flash = require('express-flash');
// const session = require('express-session');
// const jwt = require('jsonwebtoken');
const cors = require('cors');
const async = require("async");
const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
const crypto = require("crypto");
const fs = require('fs');
var formidable = require("formidable");

const DataStore = require('nedb');
const PORT = process.env.PORT || 5000;

// Set app to listen on localport 5000
// View locally running app at 127.0.0.1:5000
var server = app.listen(PORT, function() {console.log("Listening on port:" + PORT )});

module.exports = server;

// Attach database to app
const userData = new DataStore('userInfo.db');
userData.loadDatabase();
const passwordDatabase = new DataStore({filename: 'forgotPassword.db', timestampData: true});
passwordDatabase.loadDatabase();
const soundData = new DataStore('soundInfo.db');
soundData.loadDatabase();
const instrumentData = new DataStore('instrumentInfo.db')
instrumentData.loadDatabase();

// Direct node to frontend resources folder (html, css, js)
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set max json request size
app.use(express.json({limit: '10kb'}));
app.use(cors());
// app.use(session({ secret: 'session secret key' }));
// app.use(flash());


// Set site root at /public/index.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/public/home.html");
});

// Ensure that userName and email are unique in the userInfo.db database
userData.ensureIndex({fieldName: 'userName', unique: true}, function(err){});
userData.ensureIndex({fieldName: 'email', unique: true}, function(err){});
passwordDatabase.ensureIndex({fieldName: 'createdAt', expireAfterSeconds: 3600}, function(err){});


// Handles the /addUser post request
// Adds a user to the user database
app.post('/addUser', (req, res) => {
    userData.insert({userName: req.body.userName, password: req.body.password, email: req.body.email, userType: 'user'}, function(err) {
        if(err) {
            if(err.errorType === 'uniqueViolated') {
                var userNameCount = 0;
                userData.count({userName: req.body.userName}, function(err, count) {
                    userNameCount = count;
                    if(count!=0) {
                        res.status(201);
                        res.send("Username taken.");
                    }
                });
                userData.count({email: req.body.email}, function(err, count) {
                    if(count!=0 && userNameCount==0) {
                        res.status(202);
                        res.send("Email taken.");
                    }
                });
            }
        }
        else {
            res.status(200);
            res.send("User added successfully");
        }
    });
});

// Handles the /authenticateUser post request
// Compares request password and user data against matching data in the database and responds with the corresponding user data
app.post('/authenticateUser', (req, res) => {
    userData.count({userName: req.body.userName}, function(err, count) {
        if(count==1) {
            userData.find({userName: req.body.userName}, function(err, data) {
                if(data[0].password == req.body.password) {
                    res.json(data);
                }
                else {
                    res.status(201);
                    res.send("Incorrect password.")
                }
            });
        }
        else {
            res.status(202);
            res.send("User does not exist.");
        }
    });
    
});

// Handles the /changePassword post request
// Changes the password of a specified user
app.post('/changePassword', (req, res) => {
    userData.count({userName: req.body.userName}, function(err, count) {
        if(count==1) {
            userData.update(
                {userName: req.body.userName},
                { $set: {password: req.body.password}}, function(err) {
                    // Report error
                    if(err) {
                        res.status(201);
                        res.send("Password update failed.")
                    }
                    else {
                        res.status(200);
                        res.send("Password updated successfully.")
                    }
                }
            );
        }
        else {
            res.status(202);
            res.send("Password not updated: User doesnot exist")
        }
    });
    userData.persistence.compactDatafile();
});

// Handles the /removeUser post request
// Removes a user from the database
app.post('/removeUser', (req, res) => {
    userData.count({userName: req.body.userName}, function(err, count) {
        if(count == 0) {
            res.status(201);
            res.send("Remove User Failed: Does not exist.");
        }
        else {
            userData.remove(
                {userName: req.body.userName}, function(err) {
                    res.status(200);
                    res.send("Removed successfully.");
                });
        }
    });
    userData.persistence.compactDatafile();
});

// Handles the /addAdmin post request
// Adds a user as an administrator
app.post('/addAdmin', (req, res) => {
    userData.insert({userName: req.body.userName, password: req.body.password, email: req.body.email, userType: 'admin'}, function(err) {
        if(err) {
            if(err.errorType === 'uniqueViolated') {
                var userNameCount = 0;
                userData.count({userName: req.body.userName}, function(err, count) {
                    userNameCount = count;
                    if(count!=0) {
                        res.status(201);
                        res.send("Username taken.");
                    }
                });
                userData.count({email: req.body.email}, function(err, count) {
                    if(count!=0 && userNameCount==0) {
                        res.status(202);
                        res.send("Email taken.");
                    }
                });
            }
        }
        else {
            res.status(200);
            res.send("User added successfully");
        }
    });
});

// Handles the /findUsers post request
// Responds with user entries matching query
app.post('/findUsers', (req, res) => {
    let regexp = new RegExp(req.body.userName);
    userData.find({userName: regexp}).sort({userName: 1}).exec(function(err, docs) {
        res.json(docs);
    });
});

// Handles the /all post request
// Sends all userData in a response
app.post('/all', (req, res) => {
    userData.find({}, (err, data) => {
        res.json(data);
    });
});



// Password forgot
app.post('/forgot', function(req, res, next) {
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
            userData.findOne({ email: req.body.email }, function(err, user) {
                if (err || !user) {
                    console.log("No email exists.");
                    res.status(201);
                    res.send("No email exists.");
                }
                else {
                    passwordDatabase.insert({email: req.body.email, resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000}), function(error) {
                        if (error) {
                            res.status(202);
                            res.send("not inserted in database.");
                        }
                    }
                console.log("password database updated");
                var smtpTransport = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,  //587,
                    secure: true, // true for 465, false for other ports
                    service: 'gmail',
                    auth: {
                        user: 'housemusichelp@gmail.com',
                        pass:  '!password!'
                        // user: 'your email',
                        // pass:  'your password'  //process.env.GMAILPW
                    }
                });
                var mailOptions = {
                    to: user.email,
                    from: 'housemusichelp@gmail.com',   //'your email',
                    subject: 'HOUSEMUSIC Password Recovery',
                    text: 'Hi \n\n' +
                        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    res.status(200);
                    console.log("email send to user.");
                    res.send("email send to user.")
                    done(err, 'done');
                });
            }
        });
    }
    ], function(err) {
        if (err) return next(err);
            res.redirect('/forgot');
    });    
});


app.get('/reset/:token', function(req, res) {
    var token = req.params.token;
    tokenValid(token, function(result) {
        if(result==1) {
            res.render('pages/reset', {token: token});
        }
        else {
            console.log('Password reset token is invalid.');
            res.render('pages/error');
        }
    });
});

function tokenValid(token, callback) {
    passwordDatabase.count({ resetPasswordToken: token}, (err, count) => {
        callback(count);
    });
}


app.post('/reset/:token', function(req, res) {
     async.waterfall([
       function(done) {
         passwordDatabase.findOne({ resetPasswordToken: req.body.tok}, function(err, user) {
             console.log(user);
           if (user == null) {
             console.log('Password reset token is invalid or has expired.');
             res.status(201);
             res.send('Password reset token is invalid or has expired.');
             return;
           }
           var pw = req.body.password;
           var conf = req.body.confirm;

           if(pw === conf) {
                console.log("second");
                userData.update(
                 {email: user.email},
                 { $set: {password: req.body.password}}, function(err) {
                     if (err) {
                         console.log("error");
                         res.send("error");
                     }
                     var smtpTransport = nodemailer.createTransport({
                         service: 'Gmail', 
                         auth: {
                             user: 'housemusichelp@gmail.com',
                             pass:  '!password!'
                         }
                       });
                       var mailOptions = {
                         to: user.email,
                         from: 'housemusichelp@gmail.com', // 'your email',
                         subject: 'Your password has been changed',
                         text: 'Hello,\n\n' +
                           'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                       };
                       smtpTransport.sendMail(mailOptions, function(err) {
                         res.status(200);
                         console.log('Success! Your password has been changed.');
                         res.send('Success! Your password has been changed.')
                         done(err, 'done');
                       });
                    
                 });
           } 
           else {
             console.log('Passwords do not match.');
             res.status(202);
             res.send('Password donot match');
           }
         });
       }
     ], function(err) {
       res.redirect('/login');
     });
  });


app.post('/addSound', (req, res) => {
    soundData.insert({name: req.body.name, owner: req.body.owner}, function(err, data) {
        res.status(200);
        console.log(data);
        res.send(data);
    });
});

app.post('/writeSound', (req, res) => {
    console.log("hi");
    fs.writeFile("newSound.mp3", req.body, function(err) {
        if(err)
            console.log(err);
        else
            console.log("Success");
    });
});

app.post('/uploadSound', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        soundData.insert({name: req.body.name, owner: req.body.owner}, function(err, data) {
            var oldpath = files.addSound.path;
            var newpath = "/public/sounds/".concat(data._id).concat(".mp3");
            fs.rename(oldpath, newpath, function(err) {
                if(err) console.log(err);
                console.log("File uploaded.");
            });
        });
    });
});

//save and load feature
app.post('/load', (req,res) => {
    // done: load the sound (form of table)
    // TO DO: Error handling
    instrumentData.insert({name: req.body.name, soundArray: req.body.soundArray}, function(err, data) {
        if (!data) {
            console.log("error");
        }
        else {
            res.status(200);
            console.log(data);
            res.send(data);
        }
    })
})