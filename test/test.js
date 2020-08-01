var chai = require('chai');
var chaiHttp = require('chai-http');
var request = require('supertest');
var assert = require('assert');
var signup = require('../public/signupscript.js');
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
        it('Should add a new user, or inform the user of the reason for the failure.', function(done) {
            request(server)
                .post('/addUser')
                .send({'userName': 'admin', 'email': 'test543445@test.com', 'password': 'password'})
                .expect(201, done);
        });
    });
    describe('Authenticate User: ', function() {
        it('Should authenticate a user, or inform the user of the reason for the failure.', function(done) {
            request(server)
                .post('/authenticateUser')
                .send({'userName': 'admin', 'password': 'password'})
                .expect(200, done);
        });
    });
    describe('Forgot Password: ', function() {
        it('Should attempt to update a password.', function(done) {
            request(server)
                .post('/forgot')
                .send({'email': 'dne'})
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
        it('Should add a new admin, or inform the user of the reason for the failure.', function(done) {
            request(server)
                .post('/addAdmin')
                .send({'userName': 'admin', 'email': 'test543445@test.com', 'password': 'password'})
                .expect(201, done);
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
        it('Should remove a user based on the provided username.', function(done) {
            request(server)
                .post('/removeUser')
                .send({'userName': '???'})
                .expect(201, done);
        });
    });
    describe('Change Password: ', function() {
        it('Should change the password of the provided user to the provided password.', function(done) {
            request(server)
                .post('/changePassword')
                .send({'userName': '??', 'password': 'password'})
                .expect(202, done);
        });
    });
});



// signupscript.js tests

describe('Sign Up Functionality (Front end)', function() {
    describe('Reject password based on length:', function() {
        it('Should reject short passwords', function() {
            assert.equal(1, signup.test.passReqsHandler("bad"));
        });
    });
    describe('Reject passwords with disallowed characters:', function() {
        it('Should reject passwords with bad characters', function() {
            assert.equal(2, signup.test.passReqsHandler("<><><><><"));
        });
    });
    describe('Accept valid password:', function() {
        it('Should accept valid passwords', function() {
            assert.equal(0, signup.test.passReqsHandler("password"));
        });
    });
    describe('Reject username based on length:', function() {
        it('Should reject short usernames', function() {
            assert.equal(1, signup.test.userReqsHandler("bad", "test@test.com"));
        });
    });
    describe('Reject usernames with disallowed characters:', function() {
        it('Should reject usernames with bad characters', function() {
            assert.equal(2, signup.test.userReqsHandler("<><><><><", "test@test.com"));
        });
    });
    describe('Reject invalid email addresses:', function() {
        it('Should reject invalid email addresses', function() {
            assert.equal(3, signup.test.userReqsHandler("username", "bad"));
        });
    });
    describe('Accept valid usernames and emails:', function() {
        it('Should accept valid passwords', function() {
            assert.equal(0, signup.test.passReqsHandler("username", "test@test.com"));
        });
    });
});