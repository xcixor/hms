const mongoose = require('mongoose');

var validator = require('mongoose-validator');

const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
    Name: {
        type: String,
        required: [true, 'Department name should not be empty'],
        validate: [
            validator({
                validator: 'isLength',
                arguments: [2, 40],
                message: 'Department name should be between {ARGS[0]} and {ARGS[1]} characters',
            }),
            validator({
                validator: 'matches',
                arguments: /^[a-zA-Z ]*$/,
                message: 'Department name should contain alphabet characters only',
            })
        ]
    },
    HOD: {
        type: String,
        required: [true, 'NationalID field is required'],
        validate: validator({
            validator: 'isNumeric',
            message: 'National Id can only be a number'
        })
    },
    Id : {
        type: String,
        required: [true, 'The department\'s Id is required'],
        validate: [
            validator({
                validator: 'isLength',
                arguments: [2, 10],
                message: 'Id should be between {ARGS[0]} and {ARGS[1]} characters',
            }),
            validator({
                validator: 'isAlphanumeric',
                passIfEmpty: false,
                message: 'Id should contain alphabet characters only',
            })
        ]
    }
});

const DepartmentModel = mongoose.model('department', DepartmentSchema);

module.exports = DepartmentModel;