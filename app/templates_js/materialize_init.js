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
