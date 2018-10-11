// Define the hr window
var hrWindow = () => {
    var options = {
        title: 'HR Dashboard'
    };
    var url = 'app/templates/hr_dashboard.html';
    return {
        fileString: url,
        options: options
    };
};
module.exports = hrWindow();