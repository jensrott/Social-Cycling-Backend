const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../../server');

chai.use(chaiHttp);
chai.should();

describe('Server', () => {
    it('Starts the api', (done) => {
        chai.request(app)
            .get('/api/v1')
            .end((err, res) => {
                if (err) {
                    console.log(err)
                }
                res.should.have.status(200);
                done();
            })
    })
})



