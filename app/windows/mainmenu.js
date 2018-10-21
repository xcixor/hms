const {Menu} = require('electron');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


// create the menu template
let template = [
    {
        label: 'File',
        submenu: [{
            label: 'Home',
            accelerator: process.platform == 'CmdOrCtrl+H',
            click(event){
                const focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('home-page');
            }
        }]
    },
    {
    label: 'Edit',
    submenu: [
        {
            label: 'Undo',
            accelerator: process.platform == 'darwin' ? 'Command+Z' : 'Ctrl+Z',
            role: 'redo'
        },
        {
            type: 'separator'
        },
        {
            label: 'Cut',
            accelerator: process.platform == 'CmdOrCtrl+X',
            role: 'cut'
        },
        {
            label: 'Copy',
            accelerator: process.platform == 'darwin' ? 'Command+C' : 'Ctrl+C',
            role: 'copy'
        },
        {
            label: 'Paste',
            accelerator: process.platform == 'darwin' ? 'Command+V' : 'Ctrl+V',
            role: 'paste'
        },
        {
            label: 'Select All',
            accelerator: process.platform == 'darwin' ? 'Command+A' : 'Ctrl+A',
            role: 'selectall'
        },
        {
            type: 'separator'
        },
        {
            label: 'submenu',
            submenu: [
                {
                    label: 'submenu 1',
                    type: 'checkbox',
                    checked: true
                },
                {
                    label: 'submenu 2'
                }
            ]
        },
        {
            type: 'separator'
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            role: 'quit'
        }
    ]
}
];
// if mac add empty object to menu to make it visible
if (process.platform == 'darwin') {
    template.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    template.push({
        label: 'Developer Tools',
        submenu: [{
            label: 'Toggle Developer Tools',
            accelerator: process.platform == 'darwin' ? 'Command+T' : 'Ctrl+T',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        },
        {
            role: 'reload'
        }
        ]
    });
}
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);