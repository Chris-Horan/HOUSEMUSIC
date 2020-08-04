var chai = require('chai');
var chaiHttp = require('chai-http');
var request = require('supertest');
var assert = require('assert');
//const signup = require('signupscript.js');
const { expect } = require('chai');
process.env.NODE_ENV = 'test';
chai.use(chaiHttp);

describe('Login functionality (backend): ', function() {
    beforeEach(function() {
        server = require('../server');
    });
    afterEach(function() {
        server.close();
    });
    describe('Add User: ', function() {
        it('Should add a new user.', function(done) {
            request(server)
                .post('/addUser')
                .send({'userName': 'test545', 'email': 'test5435@test.com', 'password': 'password'})
                .expect(200, done);
        });
        it('Should fail to add a new user because of duplicate username.', function(done) {
            request(server)
                .post('/addUser')
                .send({'userName': 'test545', 'email': 'test5435@test.com', 'password': 'password'})
                .expect(201, done);
        });
        it('Should fail to add a new user because of duplicate email.', function(done) {
            request(server)
                .post('/addUser')
                .send({'userName': 'test54445', 'email': 'test5435@test.com', 'password': 'password'})
                .expect(202, done);
        });
    });
    describe('Authenticate User: ', function() {
        it('Should authenticate a user.', function(done) {
            request(server)
                .post('/authenticateUser')
                .send({'userName': 'admin', 'password': 'password'})
                .expect(200, done);
        });
        it('Should fail to authenticate a user because of incorrect credentials.', function(done) {
            request(server)
                .post('/authenticateUser')
                .send({'userName': 'admin', 'password': 'bad'})
                .expect(201, done);
        });
        it('Should fail to authenticate a user because user DNE.', function(done) {
            request(server)
                .post('/authenticateUser')
                .send({'userName': 'badtest343', 'password': 'password'})
                .expect(202, done);
        });
    });
    describe('Forgot Password: ', function() {
        this.timeout(5000);
        it('Should send an email with a password update link.', function(done) {
            request(server)
                .post('/forgot')
                .send({'email': 'test@test.com'})
                .expect(200, done);
        });
        it('Should reject password change attempt because email DNE.', function(done) {
            request(server)
                .post('/forgot')
                .send({'email': 'dne'})
                .expect(201, done);
        });
    });
    describe('Access change password page: ', function() {
        it('Should fail to access the change password page because of invalid token.', function(done) {
            request(server)
                .post('/reset/1')
                .send({'password': 'test', 'confirm': 'test', 'tok': '1'})
                .expect(201, done);
        });
    });
});
describe('Admin panel functionality: ', function() {
    beforeEach(function() {
        server = require('../server');
    });
    afterEach(function() {
        server.close();
    });
    describe('Add Admin: ', function() {
        it('Should add a new admin.', function(done) {
            request(server)
                .post('/addAdmin')
                .send({'userName': 'test343', 'email': 'test555@test.com', 'password': 'password'})
                .expect(200, done);
        });
        it('Should fail adding admin because of duplicate username.', function(done) {
            request(server)
                .post('/addAdmin')
                .send({'userName': 'test343', 'email': 'test45@test.com', 'password': 'password'})
                .expect(201, done);
        });
        it('Should fail adding admin because of duplicate username.', function(done) {
            request(server)
                .post('/addAdmin')
                .send({'userName': 'test3443', 'email': 'test555@test.com', 'password': 'password'})
                .expect(202, done);
        });
    });
    describe('Find Users: ', function() {
        it('Should return a list of users matching the search criteria.', function(done) {
            request(server)
                .post('/findUsers')
                .send({'userName': 'admin'})
                .expect(200, done);
        });
    });
    describe('Remove User: ', function() {
        it('Should remove added admin.', function(done) {
            request(server)
                .post('/removeUser')
                .send({'userName': 'test343'})
                .expect(200, done);
        });
        it('Should remove added user.', function(done) {
            request(server)
                .post('/removeUser')
                .send({'userName': 'test545'})
                .expect(200, done);
        });
        it('Should fail to remove user because user DNE.', function(done) {
            request(server)
                .post('/removeUser')
                .send({'userName': 'test545'})
                .expect(201, done);
        });
    });
    describe('Change Password: ', function() {
        it('Should change the password of the provided user to the provided password.', function(done) {
            request(server)
                .post('/changePassword')
                .send({'userName': 'admin', 'password': 'password'})
                .expect(200, done);
        });
        it('Should fail to change the password because user DNE.', function(done) {
            request(server)
                .post('/changePassword')
                .send({'userName': '??', 'password': 'password'})
                .expect(202, done);
        });
    });

});



// signupscript.js tests

// describe('Sign Up Functionality (Front end)', function() {
//     describe('Reject password based on length:', function() {
//         it('Should reject short passwords', function() {
//             assert.equal(1, passReqsHandler("bad"));
//         });
//     });
//     describe('Reject passwords with disallowed characters:', function() {
//         it('Should reject passwords with bad characters', function() {
//             assert.equal(2, signup.test.passReqsHandler("<><><><><"));
//         });
//     });
//     describe('Accept valid password:', function() {
//         it('Should accept valid passwords', function() {
//             assert.equal(0, signup.test.passReqsHandler("password"));
//         });
//     });
//     describe('Reject username based on length:', function() {
//         it('Should reject short usernames', function() {
//             assert.equal(1, userReqsHandler("bad", "test@test.com"));
//         });
//     });
//     describe('Reject usernames with disallowed characters:', function() {
//         it('Should reject usernames with bad characters', function() {
//             assert.equal(2, signup.test.userReqsHandler("<><><><><", "test@test.com"));
//         });
//     });
//     describe('Reject invalid email addresses:', function() {
//         it('Should reject invalid email addresses', function() {
//             assert.equal(3, signup.test.userReqsHandler("username", "bad"));
//         });
//     });
//     describe('Accept valid usernames and emails:', function() {
//         it('Should accept valid passwords', function() {
//             assert.equal(0, signup.test.passReqsHandler("username", "test@test.com"));
//         });
//     });
// });