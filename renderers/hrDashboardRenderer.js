const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;
const Employee = require('../app/models/Employee.model');
var moment = require('moment');
var jsPDF = require('jspdf');
require('jspdf-autotable');

$(document).ready(function () {
    $('select').formSelect();
    ipc.send('retrieve-employees');
    setTimeout(()=>{
        ipc.send('retrieve-departments');
    }, 100);
});

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

ipc.on('department-data-reloaded', (event, args) =>{
    $(document).ready(() => { });
    var ul = createDepUlData(args);
    $('#departmentData').append(ul.Ul);
});

ipc.on('receive-employees', (event, args) => {
    $(document).ready(()=> {
        const empRow = document.getElementById('employees');
        var ul = createEmployeeUl(args);
        empRow.appendChild(ul);
    });

});


function createEmployeeLi(args){
    var empNodes = [];
    var empVarsToDisplay = [];
    var cols = [];
    var fullname = args.Firstname + ' ' + args.Surname;
    var years = moment().diff(args.DateOfHire, 'months');
    empVarsToDisplay.push(fullname);
    empVarsToDisplay.push(years);
    empVarsToDisplay.push(args.MobilePhoneNumber);
    empVarsToDisplay.push(args.Status);
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

    $('document').ready(() => {
        $('.fixed-action-btn').floatingActionButton();
        var elems = document.querySelectorAll('.fixed-action-btn');
        var instances = M.FloatingActionButton.init(elems, {
            direction: 'left'
        });
    });
    var btnDiv = createFloatingBtn(args.NationalID, 'deleteEmpFab');
    row.appendChild(btnDiv);


    cols.forEach((col) => {
        row.appendChild(col);
    });
    const li = document.createElement('li');
    li.id = args.NationalID;
    li.appendChild(row);
    return li;
}

function createFloatingBtn(iId, aId){
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
    delA.id = aId;
    delA.setAttribute('href', '#confirmDelete');
    var btnI = document.createElement('i');
    btnI.id = iId;
    btnI.className = 'fa fa-trash';
    btnI.setAttribute('title', 'Delete');
    delA.appendChild(btnI);
    delLi.appendChild(delA);
    btnUl.appendChild(delLi);

    var editLi = document.createElement('li');
    var editA = document.createElement('a');
    editA.className = 'btn-floating red modal-trigger';
    editA.setAttribute('href', '#editUser');
    editA.id = aId;
    var btnI2 = document.createElement('i');
    btnI2.className = 'fa fa-edit';
    btnI2.id = iId;
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

        $('document').ready(() => {
            $('.fixed-action-btn').floatingActionButton();
            var elems = document.querySelectorAll('.fixed-action-btn');
            var instances = M.FloatingActionButton.init(elems, {
                direction: 'left'
            });
        });
        var btnDiv = createFloatingBtn(emp.NationalID, 'deleteEmpFab');
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
function executeDelete (message, args) {
    var reply;
    reply = ipc.sendSync(message, args);
    return reply;
}

$(".content").on('click', 'i' , event => {
        var natId;
        var className;
        var parent = event.target.parentElement;
        var parentId = parent.id;
        natId = event.target.id;
        className = event.target.className;
        if (natId != undefined){
            if(parentId =='deleteEmpFab'){
                if (className == 'fa fa-trash') {
                    const reply = ipc.sendSync('get-employee', natId);
                    document.getElementById('empToDeleteName').innerHTML = reply.message.Firstname;
                    $('#deleteUser').unbind().click(() =>{
                        var delReply = executeDelete('delete-employee', natId);
                        if (delReply.status == true) {
                            var row = document.getElementById(natId);
                            row.parentNode.removeChild(row);
                            M.toast({ html: delReply.message, classes: 'rounded green toast-head' });
                            document.getElementById('empToDeleteName').innerHTML = '';
                            natId = '';
                            className = '';
                        }else{
                            M.toast({ html: delReply.message, classes: 'rounded red toast-head' });
                            natId = '';
                            className = '';
                        }

                    });
                }
                else if (className == 'fa fa-edit') {
                    const reply = ipc.sendSync('get-employee', natId);
                    var fName = $('#empEditForm').find('#first_name').val(reply.message.Firstname);
                    var sName = $('#empEditForm').find('#surname').val(reply.message.Surname);
                    var lName = $('#empEditForm').find('#last_name').val(reply.message.Lastname);
                    var email = $('#empEditForm').find('#email').val(reply.message.Email);
                    var dob = $('#empEditForm').find('#dob').val(reply.message.DateOfBirth);
                    var nationalId = $('#empEditForm').find('#national_id').val(reply.message.NationalID);
                    var tel = $('#empEditForm').find('#tel').val(reply.message.MobilePhoneNumber);
                    var residence = $('#empEditForm').find('#residence').val(reply.message.Residence);
                    var address = $('#empEditForm').find('#address').val(reply.message.Address);
                    var genderOption;
                    switch (reply.message.Gender) {
                        case "Male":
                            genderOption = "1";
                            break;
                        case "Female":
                            genderOption = "2";
                            break;
                    }
                    var gender = $('#empEditForm').find('#gender').val(genderOption).trigger('change');
                    var doh = $('#empEditForm').find('#doh').val(reply.message.DateOfHire);
                    var statusOption;
                    switch (reply.message.Status) {
                        case true:
                            statusOption = "1";
                            break;
                        case false:
                            statusOption = "2";
                            break;
                    }
                    var status = $('#empEditForm').find('#status').val(statusOption).trigger('change');

                    // edit user
                    $('#editUserBtn').unbind().click(event => {
                        var newFName = fName.val();
                        var newLName = lName.val();
                        var newSName = sName.val();
                        var newEmail = email.val();
                        var newDob = dob.val();
                        var newNatId = nationalId.val();
                        var newTel = tel.val();
                        var newResidence = residence.val();
                        var newAddress = address.val();
                        var newGender = $('#empEditForm').find('#gender option:selected').text();
                        var newDoh = doh.val();
                        var newStatus = $('#empEditForm').find('#status option:selected').text();
                        var editStatus;
                        switch (newStatus) {
                            case "Active":
                                editStatus = true;
                                break;
                            case "Inactive":
                                editStatus = false;
                                break;
                        }
                        var newEmpDetails = {
                            "Firstname": newFName,
                            "Lastname": newLName,
                            "Surname": newSName,
                            "Email": newEmail,
                            "DateOfBirth": newDob,
                            "NationalID": newNatId,
                            "MobilePhoneNumber": newTel,
                            "Residence": newResidence,
                            "Address": newAddress,
                            "Gender": newGender,
                            "DateOfHire": newDoh,
                            "Status": editStatus
                        };
                        var editResponse = ipc.sendSync('edit-employee', [natId, newEmpDetails]);
                        if (editResponse.status == true) {
                            $(document).ready(function () {
                                $('.modal').modal('close');
                                var empData = editResponse.message;
                                var linkToRemove = document.getElementById(natId);
                                linkToRemove.parentNode.removeChild(linkToRemove);
                                var li = createEmployeeLi(empData);
                                const empList = document.getElementById('empList');
                                empList.appendChild(li);
                                $('#empEditForm').trigger('reset');
                                M.toast({ html: editResponse.message.Firstname + '\'s details successfuly edited', classes: 'rounded green toast-head' });
                                natId = '';
                                className = '';
                            });
                        }else {
                            console.log(editResponse);
                            M.toast({ html: "There are errors in the form, Please check ther errors below", classes: 'rounded red toast-head' });
                            for (var i = 0, len = editResponse.message.length; i < len; i++) {
                                M.toast({ html: editResponse.message[i], classes: 'rounded red black-text' });
                            }
                        }
                    });
                }
            }else if(parentId == 'deleteDepFab'){
                const reply = ipc.sendSync('get-department', natId);
                $('#empToDeleteName').html(reply.message.Name);
                $('#deleteUser').unbind().click(()=>{
                    var delReply = executeDelete('delete-department', natId);
                    if(delReply.status == true){
                        $('#'+natId).empty();
                        M.toast({ html: delReply.message, classes: 'rounded green toast-head' });
                        $('#empToDeleteName').html('');
                        natId = '';
                        className = '';
                    }else {
                        M.toast({ html: delReply.message, classes: 'rounded red toast-head' });
                        natId = '';
                        className = '';
                    }
                });
            }
        }else{
            natId = '';
            className = '';
        }
});

$('#printEmployee').click( e => {
    global.window = { document: { createElementNS: () => { return {} } } };
    global.navigator = {};
    global.btoa = () => { };
    var empData = ipc.sendSync('retrieve-employees-sync');
    var empDataToPrint = [];
    empData.forEach(emp => {
        var names = emp.Firstname + ' ' + emp.Surname;
        var status = emp.Status;
        var workingStatus;
        switch (status) {
            case true:
                workingStatus = 'Working';
                break;
            case false:
                workingStatus = 'Not Working';
                break;
        }
        var id = emp.NationalID;
        var mobile = emp.MobilePhoneNumber;
        var doh = emp.DateOfHire;
        empDataToPrint.push([names, workingStatus, id, mobile, doh]);
    });
    var columns = ["Names", "Working Status", "National ID", "Mobile Phone Number", "Date Of Hire"];
    var rows = [];
    empDataToPrint.forEach(empData => {
        rows.push([empData[0], empData[1], empData[2], empData[3], empData[4]]);
    });
    var doc = new jsPDF('p', 'pt');
    doc.autoTable(columns, rows);
    doc.save('employees.pdf');

    delete global.window;
    delete global.navigator;
    delete global.btoa;
});

ipc.on('home-page', e => {
    ipc.sendSync('home-page');
});

function createSelect (employees){
    var select = $('<select></select>');
    select.attr('id', 'hod');
    var option1 = $('<option></option>');
    option1.attr('value', " ");
    option1.attr('disabled', true);
    option1.attr("selected", true);
    option1.html('HOD');
    select.append(option1);

    for (var i = 0, len = employees.length; i < len; i++) {
        var opt = $('<option></option>');
        opt.attr('value', i);
        opt.html(employees[i].NationalID);
        select.append(opt);
    }
    return select;
}

$('#openDeptModal').unbind().click(e => {
    var employees = ipc.sendSync('retrieve-employees-sync');
    var select = createSelect(employees);
    $('#deptHod').prepend(select);
    $(document).ready(e => {
        $('select').formSelect();
    });
});

function validateDepartmentForm(){
    var department = {};
    var errors = [];
    var name = $('#addDepartment').find('#name').val();
    var hod = $('#addDepartment').find('#hod').val();
    var deptId = $('#addDepartment').find('#deptId').val();
    if (name == "" || !name.trim()) {
        $("#name").addClass("invalid");
        $("#name").prop("aria-invalid", "true");
        errors.push('Name is empty');
    } else {
        department.Name = name;
    }
    if (deptId == "" || !deptId.trim()) {
        $("#deptId").addClass("invalid");
        $("#deptId").prop("aria-invalid", "true");
        errors.push('Department Id is empty');
    } else {
        department.Id = deptId;
    }
    if (hod === null) {
        $('#depError').html('Head of department is required').addClass('red-text');
        errors.push('HOD is blank');
    } else {
        var departmentValue = $('#addDepartment').find('#hod option:selected').text();
        department.HOD = departmentValue;
    }
    return { 'department': department, 'errors': errors };
}

$('#saveDept').unbind().click(e => {
    var formValidation = validateDepartmentForm();
    if(formValidation.errors.length == 0){
        var createDep = ipc.sendSync('create-department', formValidation.department);
        if(createDep.status == true){
            var ul = $('#departmentsList');
            var li = createDepartmentLiData(createDep.message);
            ul.append(li);
            $('#addDepartment').trigger('reset');
            $('.select-wrapper').remove();
            $(document).ready(function () {
                $('.modal').modal('close');
            });
            setTimeout(() => {
                M.toast({ html: createDep.message.Name + ' department successfuly created', classes: 'rounded green toast-head' });
            }, 500);
        }else {
            console.log(createDep.message);
            M.toast({ html: "There are errors in the form, Please check ther errors below", classes: 'rounded red toast-head' });
            for (var i = 0, len = createDep.message.length; i < len; i++) {
                M.toast({ html: createDep.message[i], classes: 'rounded red black-text' });
            }
        }
    }else {
        M.toast({ html: "Please fix the errors in the form before saving", classes: 'rounded red toast-head' });
        for (var j = 0, length = formValidation.errors.length; j < length; j++) {
            M.toast({ html: formValidation.errors[j], classes: 'rounded red black-text' });
        }
    }
});
$('#cancelDept').unbind().click(e => {
    $('.select-wrapper').remove();
});

function createDepartmentLiData(args){
    var depNodes = [];
    var depVarsToDisplay = [];
    var cols = [];
    depVarsToDisplay.push(args.Name);
    depVarsToDisplay.push(args.Id);
    depVarsToDisplay.push(args.HOD);
    depVarsToDisplay.forEach((varToDisplay) => {
        var data = document.createTextNode(varToDisplay);
        depNodes.push(data);
    });
    depNodes.forEach((node) => {
        const col = document.createElement('div');
        col.className = 'col m3 data-value';
        col.appendChild(node);
        cols.push(col);
    });
    var row = $('<div></div>');
    row.addClass('row emp-data');
    row.attr('id', args._id);
    $('document').ready(() => {
        $('.fixed-action-btn').floatingActionButton();
        var elems = document.querySelectorAll('.fixed-action-btn');
        var instances = M.FloatingActionButton.init(elems, {
            direction: 'left'
        });
    });
    var btnDiv = createFloatingBtn(args._id, 'deleteDepFab');
    row.append(btnDiv);
    cols.forEach((col) => {
        row.append(col);
    });

    const li = $('<li></li>');
    li.id = args._id;
    li.append(row);
    return li;
}

function createDepUlData(args) {
    var rowIds = [];
    var ul = $('<ul>').attr('id', 'departmentsList');
    var rows = [];
    var lis = [];
    args.forEach(department => {
        var depNodes = [];
        var cols = [];
        var depVarsToDisplay = [];
        depVarsToDisplay.push(department.Name);
        depVarsToDisplay.push(department.Id);
        depVarsToDisplay.push(department.HOD);
        depVarsToDisplay.forEach(varToDisplay => {
            var data = document.createTextNode(varToDisplay);
            depNodes.push(data);
        });
        depNodes.forEach(node => {
            const col = $('<div></div>');
            col.addClass('col m3 data-value');
            col.append(node);
            cols.push(col);
        });
        const row = $('<div></div>');
        row.addClass('row emp-data');
        row.attr('id', department._id);
        $('document').ready(function () {
            $('.fixed-action-btn').floatingActionButton();
            var elems = document.querySelectorAll('.fixed-action-btn');
            var instances = M.FloatingActionButton.init(elems, {
                direction: 'left'
            });
        });
        row.append(createFloatingBtn(department._id, 'deleteDepFab'));

        cols.forEach(col => {
            row.append(col);
        });
        rows.push(row);
    });
    rows.forEach((row) => {
        const li = $('<li>');
        li.attr('id', row.id).attr('id', row.attr('id'));
        li.append(row);
        var id = row.attr('id');
        rowIds.push(id);
        lis.push(li);
    });
    lis.forEach((li) => {
        ul.append(li);
    });
    return { 'Ul': ul, 'Ids': rowIds };
}














// // to implement when searching
// document.getElementById('searchInputField').addEventListener('keypress', e =>{
//     var key = e.which || e.keyCode;
//     if (key === 13) {
//         console.log('Searching...');
//         console.log(document.getElementById('search').value);
//     }
// });