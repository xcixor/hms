// contextual menu import
const electron = require('electron');
const MenuItem = electron.MenuItem;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
// const ipc = electron.ipcRenderer;
//////
//contextual menu
/////
let contextMenu = new Menu();
contextMenu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
contextMenu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
contextMenu.append(new MenuItem({ label: 'Paste', role: 'paste' }));
contextMenu.append(new MenuItem({ label: 'Select All', role: 'selectall' }));
contextMenu.append(new MenuItem({ type: 'separator' }));
contextMenu.append(new MenuItem({ label: 'Refresh',
    click(event){
        const focusedWindow = BrowserWindow.getFocusedWindow();
        focusedWindow.webContents.send('reload-employees');
        focusedWindow.reload();
    }
}));

if (process.env.NODE_ENV !== 'production') {
    contextMenu.append(new MenuItem({ label: 'Toggle Dev Tools', role: 'toggledevtools' }));
}

module.exports = contextMenu;