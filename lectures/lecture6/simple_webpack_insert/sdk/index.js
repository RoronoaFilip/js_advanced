const {createPieChart} = require('./pieChart/pie_chart_sections_compute');
const {createChatBox} = require('./chat/chat_handlers')
const {createLoginForm} = require('./login_form/login_form_handler')

const sdk = {
    createPieChart,
    createChatBox,
    createLoginForm
};


window.sdk = sdk;
module.exports = sdk;