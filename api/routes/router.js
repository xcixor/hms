const express = require('express');

const router = express.Router();

const Employee = require('../models/employee.model');

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
                        res.send({ 'status': true, 'message': empToSave });
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
    // Employee.find({}, employeesProjection).then((err, employees) =>{
    //     if (err){
    //         res.status(400).send(err);
    //     }else {
    //         res.send(employees);
    //     }
    // });
    Employee.find({}, employeesProjection, (err, employees)=>{
        if (err){
            res.status(400).send(err);
        }
        res.status(200).send(employees);
    });
});

module.exports = router;