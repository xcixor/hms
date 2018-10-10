// initalize modals
$(document).ready(function() {
    $('.modal').modal();
});

// initialize select
$(document).ready(function () {
    $('select').formSelect();
});

// initialize date picker
$(document).ready(function () {
    $('.datepicker').datepicker();
    var options = {
        maxDate: new Date(),
        format: 'yyyy-mm-dd',
        yearRange: 50,

    };
    var elems = document.querySelectorAll('.datepicker');
    var instance = M.Datepicker.init(elems, options);
    instance.toString();
});

$(document).ready(function () {
    $('.fixed-action-btn').floatingActionButton();
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
        direction: 'left'
    });
});