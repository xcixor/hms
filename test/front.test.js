const electron = path.join(baseDir, 'node_modules', '.bin', 'electron');
const Application = require('spectron').Application;
const expect = require('chai').expect;

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
                expect(text).to.equal('v: 1.0.1');
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
