const config = require(__dirname + '/config/config');

const MailWorker = require(__dirname + '/worker/mail-worker');
const MailSender = require(__dirname + '/worker/mail-sender');
const TubeConsumer = require(__dirname + '/worker/tube-consumer');

let mailSender = new MailSender(config.mail);
let mailWorker = new MailWorker(mailSender);

const consumerOptions = Object.assign(config.queue, {
    handler: mailWorker,
    ignoreDefault: true,
    id: 'Mailer'
});

let queueConsumer = new TubeConsumer(consumerOptions)
queueConsumer.on('info', data => {console.log(data);})

queueConsumer.start([config.queue.mail_tube]);