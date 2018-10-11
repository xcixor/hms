var Employee = function (firstName, surName, lastName, email, dob, nationalId, tel,
    residence, address, dateOfHire, status, gender){
    var moment = require('moment');
    var employee = {};
    var constructEmployee = ()=>{
        employee.Firstname = firstName;
        employee.Lastname = lastName;
        employee.Surname = surName;
        var formattedDate = moment(dob).format('YYYY-MM-DD');
        employee.DateOfBirth = formattedDate;
        employee.NationalID = nationalId;
        employee.MobilePhoneNumber = tel;
        employee.DateOfHire = dateOfHire;
        employee.Email = email;
        employee.Residence = residence;
        employee.Address = address;
        if (status !== undefined){
            switch (status) {
                case "1":
                    employee.Status = true;
                    break;
                case "2":
                    employee.Status = false;
                    break;
            }
        }
        if (gender !== undefined) {
            switch (gender) {
                case "1":
                    employee.Gender = 'Male';
                    break;
                case "2":
                    employee.Gender = 'Female';
                    break;
            }
        }
        return {"Employee": employee};
    };
    this.getData = () => {
        return constructEmployee();
    };
};
module.exports = Employee;
