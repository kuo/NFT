module.exports = function(app) {
    // var notify = require('./public/notify');
    // app.use('/public/notify', notify);

    var submitAction = require('./public/formSubmitAction');
    app.use('/public/formSubmitAction', submitAction);
};