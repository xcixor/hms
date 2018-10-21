// Define the homepage
var homepage = () => {
    var options = {
        title: 'Homepage'
    };
    var url = 'app/templates/homepage.html';
    return {
        fileString: url,
        options: options
    };
};
module.exports = homepage();