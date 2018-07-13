require(__dirname + '/config/loader');

/** @type {Queue} */
const Queue = require(__dirname + '/services/queue');

const MailWorker = require(__dirname + '/worker/mail-worker');
console.log(_config.mail);
workers = [
    new MailWorker(_config.mail)
];

const q = new Queue(_config.queue, workers);
q.run();