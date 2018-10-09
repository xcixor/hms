// set the environment
process.env.NODE_ENV = 'dev';

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


const api = require('./api/api');

// const express = require('express');

// const bodyParser = require('body-parser');

// const mongoose = require('mongoose');

// const morgan = require('morgan');

// const config = require('config');

// const api = express();


const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

let splashWindow = require('./app/windows/splashWindow');

let mainWindow = require('./app/windows/mainWindow');

let adminLogin = require('./app/windows/adminLogin');

let adminDashboard = require('./app/windows/adminDashboard');

let accountWindow = require('./app/windows/userCreation');

let hrWindow = require('./app/windows/hrWindow');

// // connect to mongodb
// mongoose.connect(config.DBHost);
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error'));

// //don't show the log when it is test
// if (config.util.getEnv('NODE_ENV') !== 'test') {
//     //use morgan to log at command line
//     api.use(morgan('combined')); //'combined' outputs the Apache style LOGs
// }

// mongoose.Promise = global.Promise;

// api.use(bodyParser.json());

// // initialize routes
// api.use('/api', require('./api/routes/router'));

// // listen for requests
// api.listen(config.Port || 8000, () => {
//     console.log('Environment ' + process.env);
//     console.log('Listening for requests on port ' + config.Port + '.....');
// });

// // for testing
// module.exports = api;

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
    // contextMenu.getMenuItemById()
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
    if(args[0] === 'admin'){
        adminLogin.close();
        changeView(mainWindow, adminDashboard);
        event.returnValue = 'success';
    }else{
        event.returnValue = 'sth';
    }
});

ipc.on('open-create-account-window', ()=>{
    changeView(mainWindow, accountWindow);
});

ipc.on('user-login', (event, args)=>{
    changeView(mainWindow, hrWindow);
    event.returnValue = 'success';
});

ipc.on('create-user', (event, args)=>{
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:8000/api/employees';
    xhr.open('POST', url, true);
    xhr.onreadystatechange = function () {
        //Call a function when the state changes.
        if (this.readyState == XMLHttpRequest.DONE || this.status == 200 || this.status == 400 || this.status == 409 || this.status == 409) {
            event.returnValue = JSON.parse(this.responseText);
        } else {
            console.log(this.responseText);
        }
    };
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.send(JSON.stringify(args));
});

function loadEmployees(callback){
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:8000/api/employees';
    xhr.addEventListener("load", ()=>{
        var data = JSON.parse(xhr.responseText);
        callback(data);
    });
    xhr.open('GET', url);
    xhr.send();
}

ipc.on('retrieve-employees', (event, args)=>{
    loadEmployees((data)=>{
        setTimeout(() => {
            mainWindow.send('receive-employees', data);
        }, 1000);
    });
});
