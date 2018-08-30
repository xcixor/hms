const path = require('path');
const baseDir = path.join(__dirname, '..');
const electron = path.join(baseDir, 'node_modules', '.bin', 'electron');
const Application = require('spectron').Application;
const expect = require('chai').expect;
const sleep = time => new Promise(r => setTimeout(r, time));

describe('Test Splash Screen', function () {
    this.timeout(5000);
    global.app = null;

    // stand up/ set up
    before(() => {
        app = new Application({
            path: electron,
            args: ['.']
        });
        return app.start().then(() => {
            app.client.waitUntilWindowLoaded();
            return app;
        });
    });

    // your tests here
    it('should open the splash Screen', () => {
        return app.client.waitUntilWindowLoaded()
            .getWindowCount()
            .then(count => {
                expect(count).to.equal(1);
            });
    });
    // another test
    it('should open a working splash screen', () => {
        return app.client.waitUntilWindowLoaded()
            .browserWindow.isVisible()
            .then(res => {
                expect(res).to.be.true;
            })
            .browserWindow.isFocused()
            .then(res => {
                expect(res).to.be.true;
            })
            .browserWindow.isMinimized()
            .then(res => {
                expect(res).to.be.false;
            })
            .browserWindow.isDevToolsOpened()
            .then(res => {
                expect(res).to.be.false;
            })
            .browserWindow.isResizable()
            .then(res => {
                expect(res).to.be.false;
            });
    });

    // test size
    it('should open the splash screen to correct size', () => {
        return app.client.waitUntilWindowLoaded(8000)
            .browserWindow.getBounds()
            .then(res => {
                expect(res.width).to.equal(320);
                expect(res.height).to.equal(240);
            });
    });

    // test version is set
    it('should set the version on the splash screen', () => {
        return app.client.waitUntilWindowLoaded()
            .then(() => {
                return app.client.getText('#versionSpan');
            })
            .then(text => {
                expect(text).to.equal('v: 1.0.0');
            });
    });
    // tests end here
    // teardown
    after(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

});

describe('Test the login screen', function () {
    this.timeout(15000);
    // global.app = null;

    const app = new Application({
        path: electron,
        args: ['.']
    });
    before(() => {
        app.start();
    });
    after(() => {
        app.stop();
    });

    it('should check that the login page has loaded correctly', async () => {
        // sleep and wait for the login page to load
        await sleep(10000);
        // focus to the current window
        app.client.windowByIndex(0);
        const count = await app.client.getWindowCount();
        expect(count).to.equal(1);
        // check the size
        const bounds = await app.client.browserWindow.getBounds();
        expect(bounds.width).to.equal(1200);
        expect(bounds.height).to.equal(900);
    });
    it('should open a working window', async () => {
        return app.client.waitUntilWindowLoaded()
            .browserWindow.isVisible()
            .then(res => {
                expect(res).to.be.true;
            })
            .browserWindow.isResizable()
            .then(res => {
                expect(res).to.be.true;
            })
            .browserWindow.isFocused()
            .then(res => {
                expect(res).to.be.true;
            })
            .browserWindow.isMinimized()
            .then(res => {
                expect(res).to.be.false;
            });
    });

});