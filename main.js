// const {app, BrowserWindow} = require('electron');
const electron = require('electron');
// module to control application life
const app = electron.app;
// module to create native browser window
const BrowserWindow = electron.BrowserWindow;
// module to facilitate interprocess communication
const ipc = electron.ipcMain;
// contextual menu import
const MenuItem = electron.MenuItem;

const path = require('path');
const url = require('url');
const Menu = electron.Menu;

// set the environment
process.env.NODE_ENV = 'development';

let splashWindow = require('./splashWindow');

let mainWindow = require('./mainWindow');

function createWindow(screen) {
    // create the browser window
    let win = new BrowserWindow(screen.options);

    // laod index page
    win.loadURL(url.format({
        pathname: path.join(__dirname, screen.fileString),
        protocol: 'file',
        slashes: true
    }));

    win.once('ready-to-show', () => {
        win.show();
    });

    // emmitted when the window is closed
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows in an Array
        // if your app supports multiple windows, this is the time when you would
        // delete the corresponding element
        win = null;
    });
    // console.log('webContents', webContents.getAllWebContents());
    return win;
}

// Request app version number
ipc.on('get-version', event => {
    event.sender.send('set-version', app.getVersion());
});

// load splash screen
app.on('ready', () => {
    splashWindow = createWindow(splashWindow);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// load main window after splash screen spins, could be just the
// spinner with a transparent background
ipc.on('app-init', () => {
    if (splashWindow) {
        // splashWindow.close();
        setTimeout(() => {
            // mainWindow.show();
            splashWindow.close();

        }, -500);
    }
    mainWindow = createWindow(mainWindow);
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});

// create the menu template
let template = [{
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

//////
//contextual menu
/////
const contextMenu = new Menu();
contextMenu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
contextMenu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
contextMenu.append(new MenuItem({ label: 'Paste', role: 'paste' }));
contextMenu.append(new MenuItem({ label: 'Select All', role: 'selectall' }));
contextMenu.append(new MenuItem({ type: 'separator' }));
contextMenu.append(new MenuItem({ label: 'Refresh', role: 'reload' }));

// open context menu
ipc.on('show-context-menu', function (event) {
    const win = BrowserWindow.fromWebContents(event.sender);
    contextMenu.popup(win);
});
if (process.env.NODE_ENV !== 'production') {
    contextMenu.append(new MenuItem({ label: 'Toggle Dev Tools', role: 'toggledevtools' }));
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