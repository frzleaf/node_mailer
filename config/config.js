require('dotenv').load(__dirname + '/../.env');

const config = {
    queue: {
        host: process.env.BEANSTALK_HOST || 'localhost',
        port: process.env.BEANSTALK_PORT || 11300,
        mail_tube: process.env.BEANSTALK_MAIL_TUBE || 'mail_tube'
    },
    mail: {
        host: process.env.MAIL_HOST || 'localhost',
        port: process.env.MAIL_PORT || 587,
        user: process.env.MAIL_USER || 'admin@localhost',
        password: process.env.MAIL_PASSWORD,
        send_by_name: process.env.MAIL_SEND_BY_NAME || 'ERPBlock',
        send_by_email: process.env.MAIL_SEND_BY_EMAIL || 'support@erpblock.io'
    }
};

module.exports = config;