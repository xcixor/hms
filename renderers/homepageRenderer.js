const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;
const moment = require('moment');

// trigger the context menu
window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    ipc.send('show-context-menu');
});

$('document').ready( ()=> {
    setInterval( ()=>{
        $('#time').html(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));

    }, 1000);
});

$("i").hover(function () {
    $(this).css("font-size", "4em");
    $(this).removeClass('green-text');
    $(this).addClass('blue-text');
},
    function () {
        $(this).css("font-size", "3em");
        $(this).addClass('green-text');
});

$('#loginIcon').click( e => {
    ipc.send('open-login-page');
});