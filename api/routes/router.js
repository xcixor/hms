const express = require('express');

const router = express.Router();

const Employee = require('../models/employee.model');

const User = require('../models/user.model');

const bcrypt = require('bcrypt-nodejs');


// create a new employee resource
router.post('/employees', (req, res)=>{
    var id = req.body.NationalID;
    var empErrors = [];
    Employee.find({NationalID: id}, (err, employee)=>{
        if (err){
            res.status(422).send({'message': empErrors.push(err)});
        }else{
            if (employee.length == 0){
                var empToSave = new Employee(req.body);
                empToSave.save((err, empToSave) => {
                    if (err) {
                        Object.keys(err.errors).forEach(key => {
                            // empErrors.key = err.errors[key].message;
                            empErrors.push(err.errors[key].message);
                        });
                        res.status(400).json({ 'status': false, 'message': empErrors });
                    } else {
                        res.status(201).send({ 'status': true, 'message': empToSave });
                    }
                });
            }else {
                empErrors.push("An employee with a similar National ID already exists");
                res.status(409).send({'status': false, 'message': empErrors});
            }
        }
    });
});

// get a list of all employees
router.get('/employees', (req, res) => {
    var employeesProjection = {
        __v: false,
        _id: false
    };
    Employee.find({}, employeesProjection, (err, employees)=>{
        if (err){
            res.status(400).send(err);
        }
        res.status(200).send(employees);
    });
});

router.delete('/employee/:nationalId', (req, res) => {
    Employee.findOneAndDelete({ NationalID: req.params.nationalId}, (err, employee) => {
        if (err) {
            res.status(500).send({ 'status': false, 'message': err });
        }
        res.status(200).send({ 'status': true, 'message': 'Successfuly deleted ' + employee.Firstname });
    });

});

router.delete('/employees', (req,res) => {
    Employee.deleteMany({}, err => {
        if (err){
            res.status(500).send({'status': false, 'message': err});
        }
        res.status(200).send({'status': true, 'message': 'Deleted all employees'});
    });
});

router.get('/employee/:nationalId', (req, res) => {
    Employee.findOne({NationalID: req.params.nationalId}, (err, employee) => {
        if(err){
            res.status(500).send({ 'status': false, 'message': err });
        }
        if(employee == null){
            res.status(404).send({'status': false, 'message': 'User not found'});
        }else {
            res.send({ 'status': true, 'message': employee });
        }
    });
});

router.put('/employee/:nationalId', (req, res) => {
    Employee.findOneAndUpdate({ NationalID: req.params.nationalId }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true}, (err, employee) => {
        if(err){
            res.status(500).send({'status': false, 'message': err});
        }
        res.status(201).send({ 'status': true, 'message': employee });
    });
});

router.post('/user', (req, res) => {
    var userName = req.body.Username;
    var accountErrors = [];
    var body = req.body;
    var hash = bcrypt.hashSync(req.body.Password);
    body.PasswordHash = hash;
    User.find({Username: userName}, (err, user) => {
        if(err){
            res.status(422).send({'message': accountErrors.push(err)});
        }else{
            if(user.length == 0){
                User.find({EmployeeId: req.body.EmployeeId}, (err, user) => {
                    if(err){
                        res.status(422).send({ 'message': accountErrors.push(err) });
                    }else {
                        if(user.length == 0){
                            var accountData = new User(body);
                            accountData.save((err, emp) => {
                                if (err) {
                                    Object.keys(err.errors).forEach(key => {
                                        accountErrors.push(err.errors[key].message);
                                    });
                                    res.status(400).send({ 'status': false, 'message': accountErrors });
                                } else {
                                    // res.status(201).send({ 'status': true, 'message': userName + '\'s' + ' account has successfuly been created' });
                                    res.status(201).send({ 'status': true, 'message': emp });
                                }
                            });
                        }else {
                            accountErrors.push("An employee with a similar Id is already registered");
                            res.status(409).send({ 'status': false, 'message': accountErrors });
                        }
                    }
                });
            }else {
                accountErrors.push("An employee with a similar username is already registered");
                res.status(409).send({'status': false, 'message': accountErrors});
            }
        }
    });
});

router.get('/users', (req, res) => {
    var accountProjection = {
        Password: false,
        PasswordHash: false
    };
    User.find({}, accountProjection, (err, users) => {
        if(err){
            res.status(400).send(err);
        }
        res.status(200).send(users);
    });
});

router.get('/user/:_id', (req, res) => {
    User.findById(req.params._id, (err, account) => {
        if (err) {
            res.status(500).send({ 'status': false, 'message': err });
        }else {
            res.send({ 'status': true, 'message': account });
        }
    });
});

router.put('/user/:accountId', (req, res) => {
    var accountErrors = [];
    var opts = { new: true, upsert: false, setDefaultsOnInsert: true, runValidators: true }
    var hash = bcrypt.hashSync(req.body.Password);
    req.body.PasswordHash = hash;
    User.findByIdAndUpdate({ _id: req.params.accountId }, req.body, opts, (err, account) => {
        if (err) {
            if (Object.keys(err).length === 0){
                res.status(404).send({ 'status': true, 'message': "That user does not exist" });
            }else{
                Object.keys(err.errors).forEach(key => {
                    accountErrors.push(err.errors[key].message);
                });
                res.status(400).send({ 'status': false, 'message': accountErrors });
            }
        }
        else{
            res.status(201).send({ 'status': true, 'message': account });
        }
    });
});

module.exports = router;
