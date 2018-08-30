// Define the splashWindow
var splashWindow = () => {
    var options = {
        show: false,
        width: 320,
        height: 240,
        frame: false,
        resizable: false,
        backgroundColor: '#FFF',
        alwaysOnTop: true,
    };
    var url = 'app/templates/splash.html';
    return {
        fileString: url,
        options : options
    };
};
module.exports = splashWindow();