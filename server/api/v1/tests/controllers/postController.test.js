const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../../../server');

chai.use(chaiHttp);
chai.should();

require("dotenv").config();

const token = "";
const postId = '5ee7ddc077c11b1fac7d8ba6'

describe('Posts Controller', () => {
    it('Should get all posts', (done) => {
        chai.request(app)
            .get('/api/v1/posts')
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    })

    it('Should get a specific post', (done) => {
        chai.request(app)
            .get(`/api/v1/post/${postId}`)
            .set({ 'Authorization': `Bearer ${token}` })
            .end((err, res) => {
                if (err) {
                    console.log(err);
                }
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })

    })

    it('Should create a new post', (done) => {
        let body = {
            "title": "title",
            "text": "this is a test text",
        }
        chai.request(app)
            .post('/api/v1/posts')
            .set({ 'Content-type': 'application/json' })
            .set({ 'Authorization': `Bearer ${token}` })
            .send(body)
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200)
                const body = res.body
                console.log(body);

                done();
            })
    })

    it('Should Update a specific post', (done) => {
        const updatedPost = {
            "title": "Updated title",
            "text": "Updated text",
        }
        chai.request(app)
            .patch(`/api/v1/post/${postId}`)
            .set({ 'Authorization': `Bearer ${token}` })
            .send(updatedPost)
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200)
                res.body.should.be.a('object');
                done();
            })
    })

    it('Should get all posts', (done) => {
        chai.request(app)
            .get('/api/v1/posts')
            .set({ 'Authorization': `Bearer ${token}` })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200)
                res.body.should.be.a('array');
                done();
            })
    })

    it('Should Delete a specific post', (done) => {
        chai.request(app)
            .delete(`/api/v1/post/${postId}`)
            .set({ 'Authorization': `Bearer ${token}` })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200)
                res.body.should.be.a('object');
                done();
            })
    })

    it('Should like a specific post', (done) => {
        chai.request(app)
            .post(`/api/v1/post/like/${postId}`)
            .set({ 'Authorization': `Bearer ${token}` })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200)
                res.body.should.be.a('object');
                done();
            })
    })

    it('Should Unlike a specific post', (done) => {
        chai.request(app)
            .delete(`/api/v1/post/like/${postId}`)
            .set({ 'Authorization': `Bearer ${token}` })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200)
                res.body.should.be.a('object');
                done();
            })
    })

    it('Should add a comment to a specific post', (done) => {
        chai.request(app)
            .post(`/api/v1/post/comment/${postId}`)
            .set({ 'Authorization': `Bearer ${token}` })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200)
                res.body.should.be.a('object');
                done();
            })
    })

    it('Should remove a comment from a specific post', (done) => {
        const comment_id = '5ee6753485539e2d28734ff9';
        chai.request(app)
            .delete(`/api/v1/post/comment/${postId}/${comment_id}`)
            .set({ 'Authorization': `Bearer ${token}` })
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200)
                res.body.should.be.a('object');
                done();
            })
    })
})
