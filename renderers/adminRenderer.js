const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;
const $ = require('jquery');
$(document).ready(function () {
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
    return {'Ul': ul, 'Ids':rowIds};
}

window.addEventListener('contextmenu', (event) => {
    ipc.send('show-context-menu');
});

ipc.on('admin-page-reloaded', (event, args) => {
    var ulData = createAccountUlData(args);
    var uls = ulData.Ul;
    $('#accountsData').append(uls);
});

$('#accountsData').on('click', 'i', e => {
    event.preventDefault();
    var accountId;
    var btnClassName;
    accountId = event.target.id;
    btnClassName = event.target.className;
    if (accountId != "" && btnClassName == 'material-icons fa fa-edit'){
        var accountRes = ipc.sendSync('get-account', accountId);
        if (accountRes.status == true){
            var account = accountRes.message;
            $('#editAccountForm').find('#userName').val(account.Username);
            $('#editAccountForm').find('#Password').val(account.Password);
            $('#editAccountForm').find('#userId').val(account.EmployeeId);
            $('#editAccountForm').find('#department').val(account.DepartmentId);
            $('#cancelEdit').unbind().click(() => {
                $('#editAccountForm').trigger('reset');
                $('#userName').attr('disabled', true);
                $('#Password').attr('disabled', true);
            });
            var oldUserName = $('#editAccountForm').find('#userName').val();
            var oldPassword = $('#editAccountForm').find('#Password').val();

            $('#editAccount').unbind().click( ()=>{
                var editData = {};
                var newUsername = $('#editAccountForm').find('#userName');
                var newPassword = $('#editAccountForm').find('#Password');
                if (newUsername.val() != "" || newUsername.val().trim()) {
                    if(newUsername.val() != oldUserName){
                        editData.Username = newUsername.val();
                    }
                }
                if (newPassword.val() != "" || newPassword.val().trim()) {
                    if (newPassword.val() != oldPassword){
                        editData.Password = newPassword.val();
                    }
                }
                console.log(editData);
                if (Object.keys(editData).length !== 0) {
                    var editResponse = ipc.sendSync('edit-account', [accountId, editData]);
                    if (editResponse.status == true) {
                        $(document).ready(() => {
                            $('.modal').modal('close');
                            $('#editAccountForm').trigger('reset');
                            $('#userName').attr('disabled', true);
                            $('#Password').attr('disabled', true);

                            var successData = editResponse.message;
                            $('#' + accountId).empty();
                            var li = createAccountLiData(successData);
                            $('#accountsList').append(li);
                            M.toast({ html: editResponse.message.Username + ' Successfuly edited!', classes: 'rounded green toast-head' });
                        });
                    } else {
                        M.toast({ html: "There are errors in the form, Please check ther errors below", classes: 'rounded red toast-head' });
                        for (var i = 0, len = editResponse.message.length; i < len; i++) {
                            M.toast({ html: editResponse.message[i], classes: 'rounded red black-text' });
                        }
                    }
                }else {
                    $('.modal').modal('close');
                    $('#editAccountForm').trigger('reset');
                    $('#userName').attr('disabled', true);
                    $('#Password').attr('disabled', true);
                    M.toast({ html: "No changes detected", classes: 'rounded orange black-text' });
                }
            });
        }else {
            alert('That user is currently unavailable');
            $('#accountsData a').removeClass('modal-trigger');
        }
    }
    else if (accountId != undefined && btnClassName == 'material-icons fa fa-trash'){
        var confirmAccRes = ipc.sendSync('get-account', accountId);
        if (confirmAccRes.status == true){
            $('#usernameToDelete').html(confirmAccRes.message.Username);
            $('#deleteAccount').unbind().click(() => {
                var deleteReply = ipc.sendSync('delete-account', accountId);
                if(deleteReply.status == true){
                    $('#' + accountId).empty();
                    M.toast({ html: deleteReply.message, classes: 'rounded green toast-head' });
                }else {
                    $('#accountsData a').removeClass('modal-trigger');
                    alert('That user is currently unavailable');
                    $('#' + accountId).empty();
                }
            });
        }else {
            alert('That user is currently unavailable');
            $('#accountsData a').removeClass('modal-trigger');
            $('#' + accountId).empty();
        }
    }else {
        alert('That user is currently unavailable');
        $('#accountsData a').removeClass('modal-trigger');
        $('#' + accountId).empty();
    }
});

$('#editAccountForm').on('click', '#editName', e => {
    if ($('#userName').attr('disabled') == 'disabled') {
        $('#userName').attr('disabled', false);
    } else {
        $('#userName').attr('disabled', true);
    }
});

$('#editAccountForm').on('click', '#editPass', e => {
    $('#Password').attr('disabled', false);
    if ($('#Password').attr('type') == 'text') {
        $('#Password').attr('type', 'password');
        $('#Password').attr('disabled', true);
    } else {
        $('#Password').attr('type', 'text');
    }
});

ipc.on('home-page', e => {
    ipc.sendSync('home-page');
});