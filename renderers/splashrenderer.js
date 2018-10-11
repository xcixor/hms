const { ipcRenderer } = require('electron');
const ipc =ipcRenderer;

// wait for five seconds before launching the dashboard
setTimeout(() => {
    ipcRenderer.send('app-init');
}, 5000);

// set the apllication version to the splash window
ipcRenderer.on('set-version', (event, arg) => {
    console.log(event);
    const versionDisplay = document.getElementById('versionSpan');
    versionDisplay.innerHTML = `v:  ${arg}`;
});
ipcRenderer.send('get-version');