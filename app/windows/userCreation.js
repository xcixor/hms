var userAccountCreationWindow = () => {
    var options = {
        show: false,
        title: 'User Account Creation',
        backgroundColor: "#fff",
        width: 1200,
        height: 900,
        resizable: true,
        icon: __dirname + '/app/assets/icons/icon.png'
    };
    var url = 'app/templates/account_creation.html';
    return {
        fileString: url,
        options: options
    };
};
module.exports = userAccountCreationWindow();