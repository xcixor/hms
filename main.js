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

let adminLogin = require('./app/windows/adminLogin');

let adminDashboard = require('./app/windows/adminDashboard');

let accountWindow = require('./app/windows/userCreation');

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
function changeView(currentScreen, newScreen){
    currentScreen.loadURL(url.format({
        pathname: path.join(__dirname, newScreen.fileString),
        protocol: 'file',
        slashes: true
    }));
    currentScreen.setTitle(newScreen.options.title);
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

ipc.on('pop-up-admin-window', ()=> {
    if (adminLogin instanceof BrowserWindow){
        adminLogin = require('./app/windows/adminLogin');
        adminLogin.options.parent = mainWindow;
        adminLogin = createWindow(adminLogin);
    }else {
        adminLogin.options.parent = mainWindow;
        adminLogin = createWindow(adminLogin);
    }
});

ipc.on('close-admin-login-window', ()=> {
    adminLogin.close();
});

ipc.on('admin-login', function(event, args){
    // event.sender.send('admin-login-success', 'Welcome' + args[0]);
    // event.returnValue = 'admin-login-success Welcome' + args[0];
    if(args[0] === 'admin'){
        adminLogin.close();
        changeView(mainWindow, adminDashboard);
        event.returnValue = 'success';
    }else{
        event.returnValue = 'sth';
    }
    // setTimeout(()=>{
    //     adminLogin.close();
    // }, 500);
});

ipc.on('open-create-account-window', ()=>{
    changeView(mainWindow, accountWindow);
});