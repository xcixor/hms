const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;
const Employee = require('../app/models/Employee.model');
var moment = require('moment');

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
    console.log(args.DateOfHire);
    var years = moment().diff(args.DateOfHire, 'months');
    empVarsToDisplay.push(fullname);
    empVarsToDisplay.push(years);
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

    var btnDiv = createFloatingBtn(args.NationalID);
    row.appendChild(btnDiv);


    cols.forEach((col) => {
        row.appendChild(col);
    });
    const li = document.createElement('li');
    li.id = args.NationalID;
    li.appendChild(row);
    return li;
}

function createFloatingBtn(elementId){
    var btnDiv = document.createElement('div');
    btnDiv.className = 'fixed-action-btn right';

    var btnA = document.createElement('a');
    btnA.className = 'btn-floating btn-large red';
    btnA.id = 'a-float';
    var aI = document.createElement('i');
    aI.className = 'fas fa-bars';
    btnA.appendChild(aI);
    btnDiv.appendChild(btnA);

    var btnUl = document.createElement('ul');

    var delLi = document.createElement('li');
    var delA = document.createElement('a');
    delA.className = 'btn-floating red modal-trigger';
    // delA.className = 'btn-floating red';
    delA.id = 'confirmDel';
    delA.setAttribute('href', '#confirmDelete');
    var btnI = document.createElement('i');
    btnI.id = elementId;
    btnI.className = 'fa fa-trash';
    btnI.setAttribute('title', 'Delete');
    delA.appendChild(btnI);
    delLi.appendChild(delA);
    btnUl.appendChild(delLi);

    var editLi = document.createElement('li');
    var editA = document.createElement('a');
    editA.className = 'btn-floating red modal-trigger';
    var btnI2 = document.createElement('i');
    btnI2.className = 'fa fa-edit';
    btnI2.setAttribute('title', 'edit');
    editA.appendChild(btnI2);
    editLi.appendChild(editA);
    btnUl.appendChild(editLi);

    btnDiv.appendChild(btnUl);

    return btnDiv;
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
        var years;
        Object.keys(emp).forEach(function (key) {
            fullname = emp.Firstname + ' ' + emp.Surname;
            years = moment().diff(emp.DateOfHire, 'months');
        });
        empVarsToDisplay.push(fullname);
        empVarsToDisplay.push(years);
        empVarsToDisplay.push(emp.MobilePhoneNumber);
        empVarsToDisplay.push(emp.Status);
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
        var btnDiv = createFloatingBtn(emp.NationalID);
        row.appendChild(btnDiv);
        cols.forEach((col) => {
            row.appendChild(col);
        });
        rows.push(row);
    });
    rows.forEach((row) => {
        const li = document.createElement('li');
        var liId = row.id;
        li.appendChild(row);
        li.id = liId;
        lis.push(li);
    });
    lis.forEach((li) => {
        ul.appendChild(li);
    });
    return ul;
}

// const deleteBtn = document.getElementById('deleteEmp');
// deleteBtn.addEventListener('click', ()=> {
//     $(document).ready(function () {
//         $('.modal').modal('close');
//     });
// });

$(document).ready(function () {
    var natId;
    var className;
    $("i").click(function (event) {
        natId = event.target.id;
        className = event.target.className;
        if(natId != undefined && className == 'fa fa-trash'){
            console.log(natId);
            var reply = ipc.sendSync('get-employee', natId);
            document.getElementById('empToDeleteName').innerHTML = reply.message.Firstname;
            document.getElementById('deleteUser').addEventListener('click', ()=> {
                var delReply = ipc.sendSync('delete-employee', natId);
                console.log(delReply.message);
                if (delReply.status == true){
                    var row = document.getElementById(natId);
                    row.parentNode.removeChild(row);
                    M.toast({ html: delReply.message, classes: 'rounded green toast-head' });
                }
                document.getElementById('empToDeleteName').innerHTML = '';
                natId = '';
            });
        }
    });
});

document.getElementById('searchInputField').addEventListener('keypress', e =>{
    var key = e.which || e.keyCode;
    if (key === 13) {
        console.log('Searching...');
        console.log(document.getElementById('search').value);
    }
});