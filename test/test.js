var chai = require('chai');
var chaiHttp = require('chai-http');
var request = require('supertest');
process.env.NODE_ENV = 'test';
chai.use(chaiHttp);
describe('Login functionality: ', function() {
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