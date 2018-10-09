var Employee = function (firstName, surName, lastName, email, dob, nationalId, tel,
    residence, address, dateOfHire, status, gender){
    var moment = require('moment');
    var employee = {};

    var errors = [];

    var isString = (variable)=>{
        var re = /^[a-zA-Z]+$/;
        return re.test(variable);
    };

    var isNotEmpty = (variable) => {
        if (variable !== ""){
            return true;
        }
    };

    var validateEmail = email => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    var constructEmployee = ()=>{
        if (isNotEmpty(firstName)){
            if(isString(firstName)){
                employee.Firstname = firstName;
            }else{
                errors.push({"Error": "FirstName can only be alphabets"});
            }
        }else {
            errors.push({"Error": "Firstname cannot be blank"})
        }
        if (isNotEmpty(lastName)) {
            if (isString(lastName)) {
                employee.Lastname = lastName;
            } else {
                errors.push({ "Error": "LastName can only be alphabets" });
            }
        } else {
            errors.push({ "Error": "Lastname cannot be blank" })
        }
        if (isNotEmpty(surName)) {
            if (isString(surName)) {
                employee.Surname = surName;
            } else {
                errors.push({ "Error": "Surname can only be alphabets" });
            }
        } else {
            errors.push({ "Error": "Surname cannot be blank" })
        }
        if (isNotEmpty(nationalId)){
            if(!isString(nationalId)){
                employee.NationalID = nationalId;
            }else {
                errors.push({"Error": "National Id can only be a numeral"});
            }
        }else {
            errors.push({"Error": "National Id cannot be blank"});
        }
        if (isNotEmpty(dob)){
            var today = new Date();
            var newDob = new Date(dob);
            if (newDob > today) {
                errors.push({ "Error": 'Date of Birth cannot be in future' });
            } else {
                var years = moment().diff(moment(dob, "DD-MM-YYYY"), 'years');
                if (years < 18){
                    errors.push({"Error": "Employee is below legal age check Birthdate"});
                }else {
                    employee.DateOfBirth = dob;
                }
            }
        }else{
            errors.push({"Error": "Birthdate cannot be blank"});
        }
        if (isNotEmpty(tel)){
            employee.MobilePhoneNumber = tel;
        }else {
            errors.push({"Error": "Mobile phone cannot be blank"});
        }
        if (isNotEmpty(gender)){
            employee.Gender = gender;
        }else{
            errors.push({ "Error": "Gender cannot be blank" });
        }
        if (isNotEmpty(dateOfHire)){
            var date = moment(dateOfHire).format('DD-MM-YYYY');
            var now = moment().format('DD-MM-YYYY');
            if (dateOfHire > now){
                errors.push({"Error": 'Date of Hire cannot be in future'});
            }else {
                employee.DateOfHire = dateOfHire;
            }
        }else {
            errors.push({ "Error": "Date of hire cannot be blank" });
        }
        if (status !== undefined){
            switch (status) {
                case "1":
                    employee.Status = true;
                    break;
                case "2":
                    employee.Status = false;
                    break;
                default:
                // employee.Status = "";
                    errors.push({ "Error": "Employee status cannot be blank" });
            }
        }else {
            errors.push({ "Error": "Employee status cannot be blank" });
        }
        if (isNotEmpty(email)){
            if (validateEmail(email)){
                employee.Email = email;
            }else {
                errors.push({"Error": "Email is invalid"});
            }
        }
        if (isNotEmpty(residence)){
            if(isString(residence)){
                employee.Residence = residence;
            }else {
                errors.push({"Error": "Residence should not contain numbers or special characters"});
            }
        }
        if (isNotEmpty(address)){
            employee.Address = address;
        }
        return {"Errors": errors, "Employee": employee};
    };
    this.getData = () => {
        return constructEmployee();
    };
};

module.exports = Employee;
