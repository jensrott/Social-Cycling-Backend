const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../../../server');

chai.use(chaiHttp);
chai.should();

require("dotenv").config();

const token = process.env.EXAMPLE_BEARER_TOKEN;

describe('Profile Controller', () => {
    it('Should get the current logged in profile', (done) => {
        chai.request(app)
            .get('/api/v1/profile')
            .set({ 'Authorization': `Bearer ${token}` })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    })

    it('Should get all profiles', (done) => {
        chai.request(app)
            .get('/api/v1/profiles')
            .set({ 'Authorization': `Bearer ${token}` })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    })

    it('Should get a specific profile from an user by id', (done) => {
        const user_id = '123'

        chai.request(app)
            .get(`/api/v1/profile/user/${user_id}`)
            .set({ 'Authorization': `Bearer ${token}` })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    })

    it('Should get a specific profile from an user by username', (done) => {
        const username = 'user'

        chai.request(app)
            .get(`/api/v1/profile/username/${username}`)
            .set({ 'Authorization': `Bearer ${token}` })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    })

    it('Should create or update a profile', (done) => {
        done();
    })

    it('Should delete the current logged in profile', (done) => {
        chai.request(app)
            .get('/api/v1/profile')
            .set({ 'Authorization': `Bearer ${token}` })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
    })

})