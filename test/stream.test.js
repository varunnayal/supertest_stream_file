const mocha = require('mocha');
const chai = require('chai');
const request = require('supertest');
const fs = require('fs');
const path = require('path');

const app = require('../server');

const expect = chai.expect;

const streamFile = (req, file, testCallback) => {
    const stream = fs.createReadStream(file);
    stream.pipe(req, { end: false });
    stream.on('end', () => {
        req.end(testCallback);
    });
};

const FILES = {
    '225kb': path.join(__dirname, 'fixtures', 'json_data_grtr_than_100kb.json'),
    '66kb': path.join(__dirname, 'fixtures', 'json_data_grtr_64kb.json'),
    '4kb': path.join(__dirname, 'fixtures', 'books.xml'),
}

describe('/stream', function () {
    this.timeout(5000);

    it('uploading file of size = 4kb', (done) => {
        const req = request(app)
            .post('/stream')
            
        streamFile(req, FILES['4kb'], (err, resp) => {
            if (err) done(err);
            expect(resp.body).to.have.all.keys(['size']);
            expect(resp.body.size).to.be.above(2 * 1024);
            done();
        })
    });

    it('uploading file of size = 66kb', (done) => {
        const req = request(app)
            .post('/stream')
            
        streamFile(req, FILES['66kb'], (err, resp) => {
            if (err) done(err);
            expect(resp.body).to.have.all.keys(['size']);
            expect(resp.body.size).to.be.above(64 * 1024);
            done();
        })
    });

    it('uploading file of size = 225kb (Doesnot PASS)', (done) => {
        const req = request(app)
            .post('/stream')
            
        streamFile(req, FILES['225kb'], (err, resp) => {
            if (err) done(err);
            expect(resp.body).to.have.all.keys(['size']);
            expect(resp.body.size).to.be.above(192 * 1024);
            done();
        })
    });
})