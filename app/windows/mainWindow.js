var mainWindow = ()=> {
    var options = {
        show: false,
        title: 'Hotel Management System',
        backgroundColor: "#fff",
        width: 1200,
        height: 900,
        resizable: true,
        icon: __dirname + '/app/assets/icons/icon.png'
    };
    var url = 'app/templates/index.html';
    return {
        fileString: url,
        options: options
    };
};
module.exports = mainWindow();