let NodeMailer = require('nodemailer');


class MailWorker {

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
        console.log(to);
        let mailOptions = {
            from: `"${(settings && settings.send_by_name) || this.sendByName}" <${(settings && settings.send_by_email) || this.sendByEmail}>`,
            to: to,
            subject: data.subject,
            html: data.body
        };

        return await this.mailer.sendMail(mailOptions);
    }


    getName() {
        return 'ico_mail';
    }


    async work(data) {
        return await this.sendMailTo(data.to, data.data, data.settings)
    }
}

module.exports = MailWorker;