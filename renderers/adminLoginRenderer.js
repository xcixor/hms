const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;
let reply = 'no change';

const closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener('click', ()=>{
    ipc.send('close-admin-login-window');
});

const signIn = document.getElementById('loginBtn');
signIn.addEventListener('click', ()=>{
    var username = document.getElementById('admin_username').value;
    var password = document.getElementById('admin_pass').value;
    reply = ipc.sendSync('admin-login', [username, password]);
    console.log(reply);
    // if (reply === 'success'){
    //     ipc.send('close-admin-login-window');
    // }else{
    //     // error message here
    //     console.log(reply);
    // }
});

// ipc.on('admin-login-success', (event, args)=> {
//     const message = args;
//     console.log('hey');
//     console.log(args);
// });