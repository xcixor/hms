var adminLogin = () => {
    var options = {
        show: false,
        parent: '',
        modal: true,
        title: 'Admin Login',
        backgroundColor: "#fff",
        width: 465,
        height: 350,
        resizable: false,
        minimizable: false,
        maximizable: false,
        frame: false,
        thickFrame: true,
        alwaysOnTop: true
    };
    var url = 'app/templates/admin_login.html';
    return {
        fileString: url,
        options: options
    };
};
module.exports = adminLogin();