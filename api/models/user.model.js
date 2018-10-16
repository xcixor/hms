const mongoose = require('mongoose');

const validator = require('mongoose-validator');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Username: {
        type: String,
        required: [true, 'Username is required'],
        validate: [
            validator({
                validator: 'isLength',
                arguments: [4, 20],
                message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
            }),
            validator({
                validator: 'isAlpha',
                passIfEmpty: false,
                message: 'Username should contain alphabet characters only',
            }),
        ]
    },
    Password: {
        remove:true,
        type: String,
        required: [true, 'Password is required'],
        validate: [
            validator({
                validator: 'isLength',
                arguments: { min: 8, max: undefined },
                message: 'Password should not be less than 8 characters'
            }),
            validator({
                validator: 'matches',
                arguments: /^(?=.*[0-9_\W]).+$/,
                message: 'Password must contain a number or special character'
            })
        ]
    },
    PasswordHash: {
        type: String,
        required: [true, 'Password hash hasn\'t been generated!']
    },
    DepartmentId: {
        type: String,
        required: [true, 'The user\'s department is required']
    },
    EmployeeId: {
        type: String,
        required: [true, 'The user\'s Id is required']
    },
    Created: {
        type: Date,
        default: Date.now
    }
});

const UserAccountModel = mongoose.model('user', UserSchema);

module.exports = UserAccountModel;
