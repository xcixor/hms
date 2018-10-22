process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const Employee = require('../../api/models/employee.model');
const User = require('../../api/models/user.model');
const Department = require('../../api/models/departments.model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../api/api');
const should = chai.should();
const bcrypt = require('bcrypt-nodejs');

chai.use(chaiHttp);

var department = {
    "Name" : "Human Resource",
    "HOD": "29811079",
    "Id": "29811079"
};


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

describe ('Test the get one route', () => {
    before(done => {
        var employee = new Employee(testEmployee);
        employee.save((err, saved) => {
            if (err) {
                console.log(err);
            }
        });
        done();
    });
    after(done => {
        Employee.deleteMany({}, err => {
            console.log(err);
        });
        done();
    });
    it('should get an employee based on NationalID', done => {
        chai.request(server).get('/api/employee/' + testEmployee.NationalID).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').eql(true);
            res.body.message.Firstname.should.eql('Jimi');
            res.body.message.Email.should.eql('av@g.com');
            res.body.message.Status.should.eql(true);
        });
        done();
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

describe('Test the delete all route', () => {
    var testEmployee2 = {
        "Firstname": "Peter",
        "Lastname": "Njuguna",
        "Surname": "Wanyinge",
        "Email": "av@g.com",
        "DateOfBirth": "11/03/1998",
        "NationalID": "29811080",
        "MobilePhoneNumber": "0712705444",
        "Residence": "Mtito Andei",
        "Gender": "Prefer not to disclose",
        "DateOfHire": "3/4/2016",
        "Status": true
    };
    before(done => {
        var employee = new Employee(testEmployee);
        employee.save((err, saved) => {
            if (err) {
                console.log(err);
            }
        });
        var employee2 = new Employee(testEmployee2);
        employee2.save((err, saved) => {
            if (err) {
                console.log(err);
            }
        });
        done();
    });

    it('should delete all employees', done => {
        chai.request(server).del('/api/employees')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').eql(true);
                res.body.should.have.property('message').eql('Deleted all employees');
            });
        done();
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

describe('Test api can create user account', ()=>{
    beforeEach(done => {
        User.deleteMany({}, err => {
            done();
        });
    });

    afterEach(done => {
        User.deleteMany({}, err => {
            done();
        });
    });

    it('should search for empaccounts and find none', done => {
        chai.request(server).get('/api/users').end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
        });
    });
    it('should not create a user account without all the required details', done => {
        var testUser = {
            "Username": 'hradmin',
            "Password": 'hradmin2018#'
        };
        chai.request(server).post('/api/user').send(testUser).end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('status').eql(false);
            res.body.should.have.property('message').eql(
                ['The user\'s Id is required',
                'The user\'s department is required']);
            done();
        });
    });
    it('should not create an account if the password is too short', done => {
        var testUser = {
            "Username": 'hradmin',
            "Password": 'hr18',
            "DepartmentId": 'someId',
            "EmployeeId": 'empId'
        };
        chai.request(server).post('/api/user').send(testUser).end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('status').eql(false);
            res.body.should.have.property('message').eql(['Password should not be less than 8 characters']);
            done();
        });
    });
    it('should not create an account if the password does not have special xter or a number', done => {
        var testUser = {
            "Username": 'hradmin',
            "Password": 'hradmininstrator',
            "DepartmentId": 'someId',
            "EmployeeId": 'empId'
        };
        chai.request(server).post('/api/user').send(testUser).end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('status').eql(false);
            res.body.should.have.property('message').eql(['Password must contain a number or special character']);
            done();
        });
    });
    it('should create a user account with all the required details', done => {
        var testUser = {
            "Username": 'hradmin',
            "Password": 'hradmin2018#',
            "DepartmentId": 'HR001',
            "EmployeeId": 'empId'
        };
        chai.request(server).post('/api/user').send(testUser).end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('status').eql(true);
            res.body.should.be.a('object');
            res.body.message.Username.should.eql('hradmin');
            done();
        });
    });
});

describe('Test api correctly edits an account', () => {
    var testAccount = {
        "Username": 'hradmin',
        "Password": 'hradmin2018#',
        "DepartmentId": 'HR001',
        "EmployeeId": '29811079'
    };
    var accountId;

    before(done => {
        var ownerAccount = new Employee(testEmployee);
        ownerAccount.save((err, saved) => {
            if(err){
                console.log(err);
            }
        });
        var hash = bcrypt.hashSync(testAccount.Password);
        testAccount.PasswordHash = hash;
        var editAccount = new User(testAccount);
        editAccount.save((err, saved) => {
            if(err){
                console.log(err);
            }
            accountId = saved._id;
            done();
        });
    });
    after(done => {
        Employee.deleteMany({}, err => {
            console.log(err);
         });
        User.deleteMany({}, err => {
            console.log(err);
        });
        done();
    });

    it('should not edit an account with empty details', done => {
        var erroneousDets = {
            Username: '',
            Password: ''
        };
        chai.request(server).
            put('/api/user/' + accountId).
            send(erroneousDets).
            end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('status').eql(false);
                res.body.message.should.eql(
                    ['Password is required',
                        'Username is required',]);
                done();
            });
    });

    it('should not edit an account with erroneous details', done => {
        var erroneousDets = {
            Username: '1234##',
            Password: 'hradm'
        };
        chai.request(server).
            put('/api/user/' + accountId).
            send(erroneousDets).
            end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('status').eql(false);
                res.body.message.should.eql(
                    ['Password should not be less than 8 characters',
                        'Username should contain alphabet characters only',]);
                done();
            });
    });

    it('should edit the password or username only, correctly', done => {
        var editDetails = {
            'Username': 'hrmaster',
            'Password': 'hrmaster2019'
        };
        chai.request(server).
            put('/api/user/' + accountId).
            send(editDetails).
            end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('status').eql(true);
                res.body.message.Username.should.eql('hrmaster');
                res.body.message.Password.should.eql('hrmaster2019');
                res.body.message.EmployeeId.should.eql('29811079');
                done();
            });
    });
});

describe('Test the delete account route', ()=>{
    var testEmployee2 = {
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

    var testAccount = {
        "Username": 'hradmin',
        "Password": 'hradmin2018#',
        "DepartmentId": 'HR001',
        "EmployeeId": '29811079'
    };
    var accountId;

    before(done => {
        var ownerAccount = new Employee(testEmployee2);
        ownerAccount.save().then(()=> {
            var hash = bcrypt.hashSync(testAccount.Password);
            testAccount.PasswordHash = hash;
            var editAccount = new User(testAccount);
            editAccount.save((err, saved) => {
                accountId = saved._id;
                done();
            });
        });
    });
    after(done => {
        Employee.deleteMany({}, err => {
            console.log(err);
        });
        done();
    });

    it('should delete an account successfuly', done => {
        chai.request(server).del('/api/user/'+ accountId).
            end((err, res) =>{
                res.should.have.status(200);
                res.body.should.have.property('status').eql(true);
                res.body.should.have.property('message').eql('Successfuly deleted hradmin');
                done();
        });
    });
    it('should not crash if account is unavailable', done => {
        chai.request(server).del('/api/user/' + 1243434).
            end((err, res) => {
                res.should.have.status(500);
                res.body.should.have.property('status').eql(false);
                res.body.should.have.property('message').eql('Operation for that user is currently unsuccessful');
                done();
            });
    });
});

describe('Test post department route', ()=> {
    before(done => {
        var ownerAccount = new Employee(testEmployee);
        ownerAccount.save().then( ()=> {
            Department.deleteMany({}, () => {
                done();
            });
        });
    });
    after(done => {
        Employee.deleteMany({}).then( ()=> {
            Department.deleteMany({}, () => {
                done();
            });
        });
        done();
    });
    it('should not create a department without all the details', done =>{
        var testDept = {
            "Name": "Human Resource",
            "HOD": "29811079"
        };

        chai.
        request(server).
        post('/api/departments').
        send(testDept).
        end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('status').eql(false);
            res.body.should.have.property('message').
            eql(['The department\'s Id is required']);
            done();
        });
    });
    it('should not create a department with invalid data', done => {
        var testDept = {
            "Name": 12354,
            "HOD": "29811079",
            "Id": "HR001"
        };

        chai.
            request(server).
            post('/api/departments').
            send(testDept).
            end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('status').eql(false);
                res.body.should.have.property('message').
                    eql(['Department name should contain alphabet characters only']);
                done();
            });
    });
    it('should not create a non existent HOD', done => {
        var testDept = {
            "Name": "Sales and Marketing",
            "HOD": "2349890943434",
            "Id": "SM002"
        };

        chai.
            request(server).
            post('/api/departments').
            send(testDept).
            end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('status').eql(false);
                res.body.should.have.property('message').
                    eql(['There is no such an employee in our database']);
                done();
            });
    });
    it('should create a department with valid data successfuly', done => {
        chai.
            request(server).
            post('/api/departments').
            send(department).
            end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('status').eql(true);
                res.body.message.Name.should.eql('Human Resource');
                done();
            });
    });
    it('should not create the same department twice', done => {
        chai.
            request(server).
            post('/api/departments').
            send(department).
            end((err, res) => {
                res.should.have.status(409);
                res.body.should.have.property('status').eql(false);
                res.body.should.have.property('message').
                    eql(['A department with a similar name is already created']);
                done();
            });
    });
});