var adminDashboard = () => {
    var options = {
        show: false,
        title: 'Admin Dashboard',
        backgroundColor: "#fff",
        width: 1200,
        height: 900,
        resizable: true,
        icon: __dirname + '/app/assets/icons/icon.png'
    };
    var url = 'app/templates/admin_dashboard.html';
    return {
        fileString: url,
        options: options
    };
};
module.exports = adminDashboard();