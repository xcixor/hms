const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

const createAccount = document.getElementById('createAccountBtn');
createAccount.addEventListener('click', ()=>{
    ipc.send('open-create-account-window');
});