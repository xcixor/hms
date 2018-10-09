const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;
const Employee = require('../app/models/Employee.model');
const saveBtn = document.getElementById('saveUserBtn');

saveBtn.addEventListener('click', ()=>{
    var firstName = document.getElementById('first_name').value;
    var surName = document.getElementById('surname').value;
    var lastName = document.getElementById('last_name').value;
    var dob = document.getElementById('dob').value;
    var email = document.getElementById('email').value;
    var nationalId = document.getElementById('national_id').value;
    var residence = document.getElementById('residence').value;
    var address = document.getElementById('address').value;
    var doh = document.getElementById('doh').value;
    var empStatus = document.getElementById('status');
    var empStatusOption = empStatus.options[empStatus.selectedIndex].value;
    var gender = document.getElementById('gender');
    var genderValue = gender.options[gender.selectedIndex].value;
    var tel = document.getElementById('tel').value;
    var newEmployee = new Employee(firstName, surName, lastName, email, dob, nationalId,
        tel, residence, address, doh, empStatusOption, genderValue);
    var employeeData = newEmployee.getData();
    var reply = ipc.sendSync('create-user', employeeData.Employee);
    if (reply.status == false) {
        M.toast({ html: "There are errors in the form, Please check ther errors below", classes: 'rounded red toast-head' });
        for (var i = 0, len = reply.message.length; i < len; i++) {
            M.toast({ html: reply.message[i], classes: 'rounded red black-text' });
        }
    } else {
        $(document).ready(function () {
            $('.modal').modal('close');
        });
        setTimeout(()=>{
            M.toast({ html: reply.message.Firstname + ' Successfuly enrolled!', classes: 'rounded green toast-head' });
        }, 500);
        document.getElementById("empForm").reset();

        // append created user to dashboard
        var empData = reply.message;
        var li = createEmployeeLi(empData);
        const empList = document.getElementById('empList');
        empList.appendChild(li);
    }
});

window.addEventListener('contextmenu', (event)=>{
    ipc.send('show-context-menu');
    // reload loses data figure out how to recapture it
    // ipc.send('retrieve-employees');
});

ipc.on('receive-reloaded-employees', (event, args)=>{
    console.log('Hurray!');
});

ipc.on('receive-employees', (event, args) =>{
    const empRow = document.getElementById('employees');
    var ul = createEmployeeUl(args);
    empRow.appendChild(ul);
});

ipc.on('reload-employees', (event, args) =>{
    ipc.send('retrieve-employees');
});

function createEmployeeLi(args){
    var empNodes = [];
    var empVarsToDisplay = [];
    var cols = [];
    var fullname = args.Firstname + ' ' + args.Surname;
    var currentDate = new Date();
    var age = currentDate - args.DateOfBirth;
    empVarsToDisplay.push(fullname);
    empVarsToDisplay.push(age);
    empVarsToDisplay.push(args.MobilePhoneNumber);
    empVarsToDisplay.push(args.Status);
    empVarsToDisplay.push(args.Email);
    empVarsToDisplay.push(args.NationalID);
    empVarsToDisplay.forEach((varToDisplay) => {
        var data = document.createTextNode(varToDisplay);
        empNodes.push(data);
    });
    empNodes.forEach((node) => {
        const col = document.createElement('div');
        col.className = 'col m2 data-value';
        col.appendChild(node);
        cols.push(col);
    });
    var row = document.createElement('div');
    row.className = 'row emp-data';
    row.id = args.NationalID;
    cols.forEach((col) => {
        row.appendChild(col);
    });
    const li = document.createElement('li');
    li.appendChild(row);
    return li;
}

function createEmployeeUl(args){
    const ul = document.createElement('ul');
    ul.id = 'empList';
    const rows = [];
    const lis = [];

    args.forEach((emp) => {
        const empNodes = [];
        const cols = [];
        var empVarsToDisplay = [];
        var fullname = emp.Firstname + ' ' + emp.Surname;
        var currentDate = new Date();
        var age = currentDate - emp.DateOfBirth;
        Object.keys(emp).forEach(function (key) {
            fullname = emp.Firstname + ' ' + emp.Surname;
            currentDate = new Date();
            age = currentDate - emp.DateOfBirth;
        });
        empVarsToDisplay.push(fullname);
        empVarsToDisplay.push(age);
        empVarsToDisplay.push(emp.MobilePhoneNumber);
        empVarsToDisplay.push(emp.Status);
        empVarsToDisplay.push(emp.Email);
        empVarsToDisplay.push(emp.NationalID);
        empVarsToDisplay.forEach((varToDisplay) => {
            const data = document.createTextNode(varToDisplay);
            empNodes.push(data);
        });
        empNodes.forEach((node) => {
            const col = document.createElement('div');
            col.className = 'col m2 data-value';
            col.appendChild(node);
            cols.push(col);
        });
        const row = document.createElement('div');
        row.className = 'row emp-data';
        row.id = emp.NationalID;
        cols.forEach((col) => {
            row.appendChild(col);
        });
        rows.push(row);
    });
    rows.forEach((row) => {
        const li = document.createElement('li');
        li.appendChild(row);
        lis.push(li);
    });
    lis.forEach((li) => {
        ul.appendChild(li);
    });
    return ul;
}