// contextual menu import
const electron = require('electron');
const MenuItem = electron.MenuItem;
const Menu = electron.Menu;
//////
//contextual menu
/////
let contextMenu = new Menu();
contextMenu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
contextMenu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
contextMenu.append(new MenuItem({ label: 'Paste', role: 'paste' }));
contextMenu.append(new MenuItem({ label: 'Select All', role: 'selectall' }));
contextMenu.append(new MenuItem({ type: 'separator' }));
contextMenu.append(new MenuItem({ label: 'Refresh', role: 'reload' }));

if (process.env.NODE_ENV !== 'production') {
    contextMenu.append(new MenuItem({ label: 'Toggle Dev Tools', role: 'toggledevtools' }));
}

module.exports = contextMenu;