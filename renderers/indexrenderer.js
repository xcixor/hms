// import ipc render module for interprocess communication
const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

// trigger the context menu
window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    ipc.send('show-context-menu');
});

// pop up the admin login window
const loginPop = document.getElementById('loginPop');
loginPop.addEventListener('click', ()=> {
    ipc.send('pop-up-admin-window');
});

const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', ()=>{
    ipc.sendSync('user-login');
    // ipc.send('retrieve-employees');
});

ipc.on('home-page', e => {
    ipc.sendSync('home-page');
});

$('#homepage').click( e => {
    ipc.sendSync('home-page');
});