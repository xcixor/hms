const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;
const $ = require('jquery');
$(document).ready(function () {
    console.log('reload');
    ipc.send('reload-admin-page');
});

function validateAccountForm(){
    var account = {};
    var errors = [];
    var username = $('#createAccountForm').find('#username').val();
    var password = $('#createAccountForm').find('#password').val();
    var confirmPassword = $('#createAccountForm').find('#confirmPassword').val();
    var userId = $('#createAccountForm').find('#userId').val();
    var department = $('#createAccountForm').find('#department').val();
    if (username == "" || !username.trim()) {
        $("#username").addClass("invalid");
        $("#username").prop("aria-invalid", "true");
        errors.push('Username is blank');
    } else {
        account.Username = username;
    }
    if (password == "" || !password.trim()){
        $("#password").addClass("invalid");
        $("#password").prop("aria-invalid", "true");
        errors.push('Password is empty');
    }else {
        if (password !== confirmPassword) {
            $("#confirmPassword").addClass("invalid");
            $("#confirmPassword").prop("aria-invalid", "true");
            errors.push('Passwords dont match');
        } else {
            account.Password = password;
        }
    }
    if (userId == "" || !userId.trim()) {
        $("#userId").addClass("invalid");
        $("#userId").prop("aria-invalid", "true");
        errors.push('User Id is empty');
    } else {
        var checkUser = ipc.sendSync('get-employee', userId);
        if (checkUser.status == false) {
            errors.push('Employee does not exist');
            M.toast({ html: "That user does not exist in our database please check the Id again", classes: 'rounded red toast-head' });
        } else {
            account.EmployeeId = userId;
        }
    }
    if (department === null) {
        $('#depError').html('Department is required').addClass('red-text');
        errors.push('DepartmentId is blank');
    } else {
        var departmentValue = $('#createAccountForm').find('#department option:selected').text();
        account.DepartmentId = departmentValue;
    }
    return {'account': account, 'errors': errors};
}
$('#saveAccount').click( e => {
    var formValidation = validateAccountForm();
    if (formValidation.errors.length == 0){
        var creationMessage = ipc.sendSync('create-account', formValidation.account);
        if (creationMessage.status == false) {
            M.toast({ html: "There are errors in the form, Please check ther errors below", classes: 'rounded red toast-head' });
            for (var i = 0, len = creationMessage.message.length; i < len; i++) {
                M.toast({ html: creationMessage.message[i], classes: 'rounded red black-text' });
            }
        }else{
            $(document).ready(function () {
                $('.modal').modal('close');
            });

            setTimeout(() => {
                M.toast({ html: creationMessage.message.Username +'\'s' + ' account successfuly created', classes: 'rounded green toast-head' });
            }, 500);

            $('#accountForm').trigger('reset');
            var ul = $('#accountsList');
            var li = createAccountLiData(creationMessage.message);
            ul.append(li);
            $('#accountsData').append(ul);

            // setTimeout(()=> {
                // ipc.send('reload-admin-page');
            // }, 2000);
        }
    }
});

function createAccountLiData(args){
    var empNodes = [];
    var empVarsToDisplay = [];
    var cols = [];
    empVarsToDisplay.push(args.Username);
    empVarsToDisplay.push(args.DepartmentId);
    empVarsToDisplay.push(args.EmployeeId);
    empVarsToDisplay.forEach((varToDisplay) => {
        var data = document.createTextNode(varToDisplay);
        empNodes.push(data);
    });
    empNodes.forEach((node) => {
        const col = document.createElement('div');
        col.className = 'col m3 data-value';
        col.appendChild(node);
        cols.push(col);
    });
    var row = $('<div></div>');
    row.addClass('row emp-data');
    // row.className = 'row emp-data';
    row.attr('id', args._id);
    $('document').ready(() => {
        $('.fixed-action-btn').floatingActionButton();
        var elems = document.querySelectorAll('.fixed-action-btn');
        var instances = M.FloatingActionButton.init(elems, {
            direction: 'left'
        });
    });
    var btnDiv = createFAB(args._id);
    row.append(btnDiv);
    cols.forEach((col) => {
        row.append(col);
    });

    const li = $('<li></li>');
    li.id = args._id;
    li.append(row);
    return li;
}

function createFAB(elementId){
    var fabDiv = $('<div></div>');
    fabDiv.addClass('fixed-action-btn right');

    var fabA = $('<a></a>');
    fabA.addClass('btn-floating btn-large red');
    fabA.attr('id', 'a-float');
    var fabI = $('<i></i>');
    fabI.addClass('large material-icons fas fa-bars');
    fabA.append(fabI);
    fabDiv.append(fabA);

    var ul = $('<ul></ul>');

    var firstLi = $('<li></li>');
    var firstLiA = $('<a></a>');
    firstLiA.addClass('btn-floating red modal-trigger');
    firstLiA.attr('href', '#confirmDelete');
    var firstLiI = $('<i></i>');
    firstLiI.addClass('material-icons fa fa-trash');
    firstLiI.attr('id', elementId);
    firstLiI.attr('title', 'Delete');
    firstLiA.append(firstLiI);
    firstLi.append(firstLiA);
    ul.append(firstLi);

    var secondLi = $('<li></li>');
    var secondLiA = $('<a></a>');
    secondLiA.addClass('btn-floating red modal-trigger');
    secondLiA.attr('href', '#editUser');
    var secondLiI = $('<i></i>');
    secondLiI.addClass('material-icons fa fa-edit');
    secondLiI.attr('id', elementId);
    secondLiI.attr('title', 'Edit');
    secondLiA.append(secondLiI);
    secondLi.append(secondLiA);
    ul.append(secondLi);

    fabDiv.append(ul);

    return fabDiv;
}

function createAccountUlData(args){
    var rowIds = [];
    var ul = $('<ul>').attr('id', 'accountsList');
    var rows = [];
    var lis = [];
    args.forEach(account => {
        var empNodes = [];
        var cols = [];
        var empVarsToDisplay = [];
        empVarsToDisplay.push(account.Username);
        empVarsToDisplay.push(account.DepartmentId);
        empVarsToDisplay.push(account.EmployeeId);
        empVarsToDisplay.forEach(varToDisplay => {
            var data = document.createTextNode(varToDisplay);
            empNodes.push(data);
        });
        empNodes.forEach(node => {
            const col = $('<div></div>');
            col.addClass('col m3 data-value');
            col.append(node);
            cols.push(col);
        });
        const row = $('<div></div>');
        row.addClass('row emp-data');
        row.attr('id', account._id);
        $('document').ready(function (){
            $('.fixed-action-btn').floatingActionButton();
            var elems = document.querySelectorAll('.fixed-action-btn');
            var instances = M.FloatingActionButton.init(elems, {
                direction: 'left'
            });
        });
        row.append(createFAB(account._id));

        cols.forEach(col => {
            row.append(col);
        });
        rows.push(row);
    });
    rows.forEach((row) => {
        const li = $('<li>').attr('id', row.id);
        li.append(row);
        var id = row.attr('id');
        rowIds.push(id);
        lis.push(li);
    });
    lis.forEach((li) => {
        ul.append(li);
    });
    return {'Ul': ul, 'Ids':rowIds};
}

window.addEventListener('contextmenu', (event) => {
    ipc.send('show-context-menu');
});

ipc.on('admin-page-reloaded', (event, args) => {
    console.log('reloaded');
    var ulData = createAccountUlData(args);
    var uls = ulData.Ul;
    $('#accountsData').append(uls);
});
