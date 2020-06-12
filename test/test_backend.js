//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Todo = require('../model/Todo');
let User = require('../model/User');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
const should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Remove DB Todo App', () => {
    before((done) => { //Before each test we empty the database
        User.deleteMany({}, (err) => { 
           done();           
        });         
    });
    before((done) => { //Before each test we empty the database
        Todo.deleteMany({}, (err) => { 
           done();           
        });         
    });
/*
  * Test the /users/register route
  */
    describe('/users/register', () => {
        it('it should POST user Registration Correctly', (done) => {
            let user = {
                name:"Christian Mahardhika",
                username:"ctianm",
                email:"christian_mahardhika@telkomsel.co.id",
                password:"1234567890",
                confirm_password:"1234567890"
            }
            chai.request(server)
                .post('/api/users/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql('Hurry! User is now registered.');
                    res.body.should.have.property('success').eql(true);
                done();
                });
        });
  
        it('it should Failed user diferent password', (done) => {
            let user = {
                name:"Christian Mahardhika",
                username:"ctianm",
                email:"christian_mahardhika@telkomsel.co.id",
                password:"1234567890",
                confirm_password:"123456789"
            }
            chai.request(server)
                .post('/api/users/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql('Password does not match.');
                  done();
                });
          });

        it('it should failed username already exist', (done) => {
            let user = {
              name:"Christian Mahardhika",
              username:"ctianm",
              email:"christian_mahardhikaa@telkomsel.co.id",
              password:"1234567890",
              confirm_password:"1234567890"
            }
            chai.request(server)
                .post('/api/users/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql('Username is already taken.');
                  done();
                });
          });

        it('it should failed email already exist', (done) => {
            let user = {
                name:"Christian Mahardhika",
                username:"ctianm1",
                email:"christian_mahardhika@telkomsel.co.id",
                password:"1234567890",
                confirm_password:"1234567890"
            }
            chai.request(server)
                .post('/api/users/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql('Email is already registred. Did you forgot your password.');
                    done();
                });
        });
  
    });

/*
  * Test the /users/register route
  */
 describe('/users/login', () => {
    it('it should POST user Login Failed because Username not found', (done) => {
        let user = {
            username:"ctianm1",
            password:"1234567890"
        }
        chai.request(server)
            .post('/api/users/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('msg').eql('Username is not found.');
                res.body.should.have.property('success').eql(false);
            done();
            });
    });

    it('it should POST user login with wrong password', (done) => {
        let user = {
            username:"ctianm",
            password:"123456789"
        }
        chai.request(server)
            .post('/api/users/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('msg').eql('Incorrect password.');
                res.body.should.have.property('success').eql(false);
              done();
            });
      });

    it('it should POST corect user & pass ', (done) => {
        let user = {
            username:"ctianm",
            password:"1234567890"
        }
        chai.request(server)
            .post('/api/users/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg').eql('Hurry! You are now logged in.');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('token')
                res.body.should.have.property('user')
              done();
            });
      });

});


});