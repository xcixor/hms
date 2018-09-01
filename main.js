// const {app, BrowserWindow} = require('electron');
const electron = require('electron');
// module to control application life
const app = electron.app;
// module to create native browser window
const BrowserWindow = electron.BrowserWindow;
// module to facilitate interprocess communication
const ipc = electron.ipcMain;

const path = require('path');
const url = require('url');

const contextMenu = require('./app/windows/maincontextmenu');

// set the environment
process.env.NODE_ENV = 'development';

let splashWindow = require('./app/windows/splashWindow');

let mainWindow = require('./app/windows/mainWindow');

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
    require('./app/windows/mainmenu');
});

// open context menu
ipc.on('show-context-menu', function (event) {
    const win = BrowserWindow.fromWebContents(event.sender);
    contextMenu.popup(win);
});
