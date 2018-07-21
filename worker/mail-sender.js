let NodeMailer = require('nodemailer');


class MailSender {

    constructor(mailConfig) {
        const transporter = NodeMailer.createTransport({
            host: mailConfig.host,
            port: mailConfig.port,
            secure: false, // secure:true for port 465, secure:false for port 587
            auth: {
                user: mailConfig.user,
                pass: mailConfig.password
            },
            tls: {rejectUnauthorized: false}
        });

        this.sendByName = mailConfig.send_by_name || 'NoReply';
        this.sendByEmail = mailConfig.send_by_email || mailConfig.user;
        this.mailer = transporter;
    }


    async sendMailTo(to, data, settings = null) {
        console.log(`[M] send mail to ${to}`);
        let mailOptions = {
            from: `"${(settings && settings.send_by_name) || this.sendByName}" <${(settings && settings.send_by_email) || this.sendByEmail}>`,
            to: to,
            subject: data.subject,
            html: data.body
        };

        return await this.mailer.sendMail(mailOptions);
    }
    

    async send(sendingInfo) {
        if(!sendingInfo.to || !sendingInfo.data){
            throw new Error('Invalid sending mail object: ' + JSON.stringify(sendingInfo));
        }
        return await this.sendMailTo(sendingInfo.to, sendingInfo.data, sendingInfo.settings)
    }
}

module.exports = MailSender;