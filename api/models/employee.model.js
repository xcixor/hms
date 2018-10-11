const mongoose = require('mongoose');

var validator = require('mongoose-validator');

const Schema = mongoose.Schema;

var moment = require('moment');

var now = moment();
var workingDate = now.subtract(18, 'years');
workingDate = workingDate.format('YYYY-MMM-DD');

const EmployeeSchema = new Schema({
    Firstname: {
        type: String,
        required: [true, 'Firstname should not be empty'],
        validate: [
            validator({
                validator: 'isLength',
                arguments: [2, 40],
                message: 'Firstname should be between {ARGS[0]} and {ARGS[1]} characters',
            }),
            validator({
                validator: 'isAlpha',
                passIfEmpty: false,
                message: 'Firstname should contain alphabet characters only',
            })
        ]
    },
    Lastname: {
        type: String,
        required: [true, 'Lastname should not be empty'],
        validate: [
            validator({
                validator: 'isLength',
                arguments: [2, 40],
                message: 'Lastname should be between {ARGS[0]} and {ARGS[1]} characters',
            }),
            validator({
                validator: 'isAlpha',
                passIfEmpty: false,
                message: 'Lastname should contain alphabet characters only',
            }),
        ]
    },
    Surname: {
        type: String,
        required: [true, 'Surname should not be empty'],
        validate: [
            validator({
                validator: 'isLength',
                arguments: [2, 40],
                message: 'Surname should be between {ARGS[0]} and {ARGS[1]} characters',
            }),
            validator({
                validator: 'isAlpha',
                passIfEmpty: false,
                message: 'Surname should contain alphabet characters only',
            }),
        ]
    },
    Email: {
        type: String,
        required: false,
        default: 'Email not defined',
        validate: validator({
            validator: 'isEmail',
            passIfEmpty: true,
            message: 'Invalid email address',
        }),
    },
    DateOfBirth: {
        type: String,
        required: [true, 'Birthdate field is required'],
        validate: validator({
            validator: 'isBefore',
            arguments: workingDate,
            message: 'Employee should not be less that 18 yrs check Birthdate again!'
        })
    },
    NationalID: {
        type: String,
        required: [true, 'NationalID field is required'],
        validate: validator({
            validator: 'isNumeric',
            message: 'National Id can only be a number'
        })
    },
    MobilePhoneNumber: {
        type: String,
        required: [true, 'Mobile Phone Number should not be empty'],
        validate: validator({
            validator: 'isLength',
            arguments: [10, 14],
            message: 'Phone Number should be between {ARGS[0]} and {ARGS[1]} characters',
        }),
    },
    Residence: {
        type: String,
        default: 'Residence not defined'
    },
    Address: {
        type: String,
        default: 'Address not defined'
    },
    Gender: {
        type: String,
        required: [true, 'Gender is required']
    },
    DateOfHire: {
        type: String,
        required: [true, 'DateOfHire field is required']
    },
    Status: {
        type: Boolean,
        required: [true, 'Status field is required']
    },
    Created: {
        type: Date,
        default: Date.now
    },
});

const EmployeeModel = mongoose.model('employee', EmployeeSchema);

module.exports = EmployeeModel;