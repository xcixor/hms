// const path = require('path');
// const baseDir = path.join(__dirname, '..');
// const electron = path.join(baseDir, '../node_modules', '.bin', 'electron');
// const Application = require('spectron').Application;
// const chai = require('chai');
// const expect = require('chai').expect;
// const sleep = time => new Promise(r => setTimeout(r, time));
// chai.use(function (_chai, _) {
//     _chai.Assertion.addMethod('withMessage', function (msg) {
//         _.flag(this, 'message', msg);
//     });
// });
// const $ = require('$');
// const $ = require('jquery');
// var jsdom = require('jsdom');
// $ = require('jquery')(new jsdom.JSDOM().window);


// describe('Test Splash Screen', function () {
//     this.timeout(6000);
//     let app = null;

//     // stand up/ set up
//     before(() => {
//         app = new Application({
//             path: electron,
//             args: ['.']
//         });
//         return app.start().then(() => {
//             app.client.waitUntilWindowLoaded();
//             return app;
//         });
//     });

//     it('should open the splash Screen', () => {
//         return app.client.waitUntilWindowLoaded()
//             .getWindowCount()
//             .then(count => {
//                 expect(count).to.equal(1);
//             });
//     });
//     // another test
//     it('should open a working splash screen', () => {
//         return app.client.waitUntilWindowLoaded()
//             .browserWindow.isVisible()
//             .then(res => {
//                 expect(res).to.be.true;
//             })
//             .browserWindow.isFocused()
//             .then(res => {
//                 expect(res).to.be.true;
//             })
//             .browserWindow.isMinimized()
//             .then(res => {
//                 expect(res).to.be.false;
//             })
//             .browserWindow.isDevToolsOpened()
//             .then(res => {
//                 expect(res).to.be.false;
//             })
//             .browserWindow.isResizable()
//             .then(res => {
//                 expect(res).to.be.false;
//             });
//     });

//     // test size
//     it('should open the splash screen to correct size', () => {
//         return app.client.waitUntilWindowLoaded(8000)
//             .browserWindow.getBounds()
//             .then(res => {
//                 expect(res.width).to.equal(320);
//                 expect(res.height).to.equal(240);
//             });
//     });

//     // test version is set
//     it('should set the version on the splash screen', () => {
//         return app.client.waitUntilWindowLoaded()
//             .then(() => {
//                 return app.client.getText('#versionSpan');
//             })
//             .then(text => {
//                 expect(text).to.equal('v: 1.0.0');
//             });
//     });
//     // tests end here
//     // teardown
//     after(() => {
//         if (app && app.isRunning()) {
//             return app.stop();
//         }
//     });

// });

// describe('Test the login screen', function () {
//     this.timeout(15000);
//     const app = new Application({
//         path: electron,
//         args: ['.']
//     });
//     before(() => {
//         app.start();
//     });
//     after(() => {
//         app.stop();
//     });

//     it('should check that the login page has loaded correctly', async () => {
//         // sleep and wait for the login page to load
//         await sleep(10000);
//         // focus to the current window
//         app.client.windowByIndex(0);
//         const count = await app.client.getWindowCount();
//         expect(count).to.equal(1);
//         // check the size
//         const bounds = await app.client.browserWindow.getBounds();
//         expect(bounds.width).to.equal(1200);
//         expect(bounds.height).to.equal(900);
//     });
//     it('should open a working sign in window', async () => {
//         return app.client.waitUntilWindowLoaded()
//             .browserWindow.isVisible()
//             .then(res => {
//                 expect(res).to.be.true;
//             })
//             .browserWindow.isResizable()
//             .then(res => {
//                 expect(res).to.be.true;
//             })
//             .browserWindow.isFocused()
//             .then(res => {
//                 expect(res).to.be.true;
//             })
//             .browserWindow.isMinimized()
//             .then(res => {
//                 expect(res).to.be.false;
//             });
//     });
// });

// describe('Test the admin login', function () {
//     this.timeout(20000);
//     const app = new Application({
//         path: electron,
//         args: ['.'],
//         port: 9500
//     });
//     before(() => {
//         app.start();
//         // app.client.timeouts({
//         //     quitTimeout: 3000
//         // });
//     });
//     after(() => {
//         app.stop();
//     });
//     // this.beforeAll(() => {
//     //     app.restart();
//     // });
//     it('should launch login successfuly', async () => {
//         await sleep(10000);
//         // focus to the current window
//         await app.client.windowByIndex(0);
//         const count = await app.client.getWindowCount();
//         expect(count).to.equal(1);
//     });
//     it('should open a working admin login window', async () => {
//         await app.client.click('#loginPop');
//         // ensure the login window has been created
//         const count = await app.client.getWindowCount();
//         expect(count).to.equal(2);
//         // set login window to active
//         await app.client.windowByIndex(1);
//         // confirm window properties
//         const bounds = await app.client.waitUntilWindowLoaded().browserWindow.getBounds();
//         expect(bounds.height).to.equal(350);
//         expect(bounds.width).to.equal(465);
//         const isResizable = await app.client.waitUntilWindowLoaded().browserWindow.isResizable();
//         expect(isResizable).to.be.false;
//         const onTop = await app.client.waitUntilWindowLoaded().browserWindow.isAlwaysOnTop();
//         expect(onTop).to.be.true;
//         const isModal = await app.client.waitUntilWindowLoaded().browserWindow.isModal();
//         expect(isModal).withMessage('Window is not modal').to.be.true;
//         // check admin login form
//         const adminLoginForm = await app.client.getHTML('#adminLoginForm');
//         expect(adminLoginForm).not.empty;

//         // fill out login form to login validate and close admin login
//         await app.client.setValue('#admin_username', 'admin');
//         await app.client.setValue('#admin_pass', 'adminpass');
//         const res = await app.client.click('#loginBtn');

//         const newCount = await app.client.getWindowCount();
//         expect(newCount).withMessage('Admin login window cannot close').to.equal(1);

//         // navigate to admin dashboard
//         await sleep(2000);
//         await app.client.windowByIndex(0);
//         const title = await app.client.waitUntilWindowLoaded().browserWindow.getTitle();
//         expect(title).withMessage('Admin dashboard not loaded').to.equal('Admin Dashboard');



//         // await app.client.click('#closeBtn');
//         // const newCount = await app.client.getWindowCount();
//         // expect(newCount).withMessage('Admin login window cannot close').to.equal(1);
//     });
// });

// describe('Test the admin dashboard', function () {
//     this.timeout(20000);
//     const app = new Application({
//         path: electron,
//         args: ['.'],
//         port: 9501
//     });
//     before(() => {
//         app.start();
//     });
//     after(() => {
//         app.stop();
//     });

//     it('should launch login successfuly', async () => {
//         await sleep(10000);
//         // focus to the current window
//         await app.client.windowByIndex(0);
//         const count = await app.client.getWindowCount();
//         expect(count).to.equal(1);
//     });
//     it('should open a working admin dashboard', async () => {
//         await app.client.click('#loginPop');
//         // ensure the login window has been created
//         const count = await app.client.getWindowCount();
//         expect(count).to.equal(2);
//         // set login window to active
//         await app.client.windowByIndex(1);

//         // fill out login form to login validate and close admin login
//         await app.client.setValue('#admin_username', 'admin');
//         await app.client.setValue('#admin_pass', 'adminpass');
//         await app.client.click('#loginBtn');
//         await sleep(500);
//         const newCount = await app.client.getWindowCount();
//         expect(newCount).withMessage('Admin login window cannot close').to.equal(1);

//         // navigate to admin dashboard
//         await sleep(2000);
//         await app.client.windowByIndex(0);
//         let title = await app.client.waitUntilWindowLoaded().browserWindow.getTitle();
//         expect(title).withMessage('Admin dashboard not loaded').to.equal('Admin Dashboard');

//         // open the create new user account form
//         await app.client.click('#createAccountBtn');
//         await sleep(2000);
//         await app.client.windowByIndex(0);
//         title = await app.client.waitUntilWindowLoaded().browserWindow.getTitle();
//         expect(title).withMessage('User Creation dashboard not loaded').to.equal('User Account Creation');
//         // check create account form
//         const createAccountForm = await app.client.getHTML('#createAccountForm');
//         expect(createAccountForm).withMessage('Create account form not found').not.empty;
//     });
// });

// describe('Test the HR dashboard', function () {
//     this.timeout(35000);
//     const app = new Application({
//         path: electron,
//         args: ['.'],
//         port: 9502
//     });
//     before(() => {
//         app.start();
//     });
//     after(() => {
//         app.stop();
//     });

//     it('should login in hr and open his dashboard', async () => {
//         await sleep(15000);
//         // focus to the current window
//         await app.client.windowByIndex(0);
//         const count = await app.client.getWindowCount();
//         expect(count).to.equal(1);

//         // fill out login form to login validate and close login
//         await app.client.setValue('#username', 'hr');
//         await app.client.setValue('#password', 'hr');
//         await app.client.click('#loginBtn');
//         await sleep(500);
//         const newCount = await app.client.getWindowCount();
//         expect(newCount).withMessage('Login window cannot close').to.equal(1);

//         // check in admin dashboard
//         let title = await app.client.waitUntilWindowLoaded().browserWindow.getTitle();
//         expect(title).withMessage('HR dashboard not loaded').to.equal('HR Dashboard');
//     });
//     it('should find the dashboard already populated with employee data', async () => {
//         await sleep(2000);
//         const message = await app.client.getText('.departments');
//         expect(message).withMessage('Employee data not set').to.equal('Broadcast from main');
//     });

//     it('should save a new employee', async ()=> {
//         await sleep(1000);
//         await app.client.click('#createUserBtn');
//         await app.client.setValue('#first_name', 'peter');
//         await app.client.setValue('#surname', 'Njuguna');
//         await app.client.setValue('#last_name', 'Ndungu');
//         await app.client.setValue('#email', 'pndungu54@gmail.com');
//         await app.client.setValue('#dob', '11/03/1998');
//         await app.client.setValue('#national_id', '29811089');
//         await app.client.setValue('#tel', '+254712705422');
//         await app.client.setValue('#residence', 'Emba');
//         await app.client.setValue('#address', 'P.O.BOX 1234');
//         // var selectBox = await app.client.element('#gender');
//         // await selectBox.selectByAttribute('value', '1');
//         await app.client.setValue('#doh', 'Sep 03, 2018');
//         await app.client.setValue('#status', 'active');
//         await app.client.click('#saveUserBtn');
//         await sleep(2500);
//         const empName = await app.client.getText('#firstName');
//         expect(empName).withMessage('Employee data not yet set on the dashboard').to.equal('peter');
//     })
// });