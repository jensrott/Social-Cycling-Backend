// // https://blog.khophi.co/mocha-chai-chai-http-test-express-api-auth-endpoints/

// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app = require('../../../../../server');

// // const mongoose = require('mongoose');
// const User = require('../../models/userModel');

// chai.use(chaiHttp);
// chai.should();
// chai.expect();

// describe('Create Account, Login and Check Token', () => {
//     beforeEach((done) => {
//         // Reset user mode before each test
//         User.remove({}, (err) => {
//             console.log(err);
//             done();
//         })
//     });

//     describe('Auth Controller', () => {
//         it('Should create a new user, login with that user and check the token', (done) => {
//             let registerBody = {
//                 "name": "John",
//                 "email": "email@email.com",
//                 "password": "secret",
//                 "gravatar": "https://secure.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
//             }

//             let loginBody = {
//                 "email": "email@email.com",
//                 "password": "secret",
//             }
//             chai.request(app)
//                 .post('/api/v1/users/register')
//                 .send(registerBody)
//                 .end((err, res) => {
//                     if (err) {
//                         console.log(err)
//                     }
//                     console.log('Register');
//                     res.should.have.status(201);
//                     expect(res.body.state).to.be.true;

//                     // follow up with login
//                     chai.request(app)
//                         .post('/api/v1/users/login')
//                         .send(loginBody)
//                         .end((err, res) => {
//                             if (err) {

//                             }
//                             console.log('Login');
//                             res.should.have.status(201);
//                             expect(res.body.state).to.be.true;
//                             res.body.should.have.property('token');

//                             let token = res.body.token;
//                             // Check if user can visit protected page
//                             chai.request(app)
//                                 .get('/api/v1/profile')
//                                 .set('Authorization', token)
//                                 .end((err, res) => {
//                                     if (err) {

//                                     }
//                                     console.log('visit protected profile route')
//                                     res.should.have.status(201);
//                                     expect(res.body.state).to.be.true;
//                                     res.body.data.should.be.an('object')
//                                     done();
//                                 })
//                         })
//                 })
//         })
//     })
// })
