process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const Employee = require('../../api/models/employee.model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../api/api');
const should = chai.should();

chai.use(chaiHttp);

var testEmployee = {
    "Firstname": "Jimi",
    "Lastname": "Mburi",
    "Surname": "Wanyinge",
    "Email": "av@g.com",
    "DateOfBirth": "11/03/1998",
    "NationalID": "29811079",
    "MobilePhoneNumber": "0712705422",
    "Residence": "Mtito Andei",
    "Gender": "Prefer not to disclose",
    "DateOfHire": "3/4/2016",
    "Status": true
};

describe('Test the Post route', ()=>{
    beforeEach(done => {
        Employee.deleteMany({}, err => {
            done();
        });
    });

    afterEach(done => {
        Employee.deleteMany({}, err => {
            done();
        });
    });

    it('should get all the employees and find none', done => {
        chai.request(server).get('/api/employees').end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
        });
    });

    it('should not create an employee without the required fields', done => {
        var employee = {
            "Firstname": "Jimi",
            "Surname": "Wanyinge",
            "Email": "av@g.com",
            "NationalID": "29811079",
            "Gender": "Prefer not to disclose",
            "DateOfHire": "3/4/2016",
            "Status": true
        };
        chai.request(server).post('/api/employees').send(employee).end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(false);
            res.body.should.have.property('message').eql(
                ['Mobile Phone Number should not be empty',
                    'Birthdate field is required',
                    'Lastname should not be empty']);
            done();
        });
    });

    it('should create a user successfuly', done => {
    chai.request(server).post('/api/employees').send(testEmployee).end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql(true);
        res.body.message.Firstname.should.eql('Jimi');
        done();
    });
});
});

describe ('Test the delete route', ()=> {
    it('should get all the employees and find none', done => {
        chai.request(server).get('/api/employees').end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
        });
    });
    it('should create a user successfuly', done => {
        chai.request(server).post('/api/employees').send(testEmployee).end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(true);
            res.body.message.Firstname.should.eql('Jimi');
            done();
        });
    });
    it('should delete a user successfuly', done => {
        chai.request(server).del('/api/employee/' + testEmployee.NationalID).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').eql(true);
            res.body.should.have.property('message').eql('Successfuly deleted Jimi');
            done();
        });
    });
    it('should get all the employees and find none', done => {
        chai.request(server).get('/api/employees').end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
        });
    });
});

describe('Test api can edit an employee', () => {

    after(done => {
        Employee.deleteMany({}, err => {
            done();
        });
    });

    it('should create a user successfuly', done => {
        chai.request(server).post('/api/employees').send(testEmployee).end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(true);
            res.body.message.Firstname.should.eql('Jimi');
            done();
        });
    });

    var editDetails = {
        "Firstname": "Jimi",
        "Surname": "Wanyinge",
        "Email": "wanyinge@gmail.com",
        "NationalID": "29811079",
        "Gender": "Male",
        "DateOfHire": "3/4/2016",
        "Status": false
    };

    it('should edit the employee details', done => {
        chai.request(server).put('/api/employee/'+ testEmployee.NationalID).send(editDetails).end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('status').eql(true);
            res.body.message.Firstname.should.eql('Jimi');
            res.body.message.Email.should.eql('wanyinge@gmail.com');
            res.body.message.Status.should.eql(false);
        });
        done();
    });
});