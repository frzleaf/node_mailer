const events = require('events');


class MailWorker {

    constructor(mailSender) {
        this.mailSender = mailSender;
        events.EventEmitter.call(this);
    }

    work(data, callBack) {
        let sendingObject = {};
        if (data instanceof Object) {
            sendingObject = data;

        } else {
            const str = data.toString('utf8');

            if (!str) {
                console.log('[Q] Empty input data');
                callBack('success');
                return;
            }

            let sendingObject = null;
            console.log(str[1]);
            try {
                if (/^[\[\{ ].+/.test(str)) {
                    sendingObject = JSON.parse(str);

                } else {
                    // PHP serialize
                    let convertedStr = str.slice(str.indexOf('"') + 1);
                    convertedStr = convertedStr.slice(0, convertedStr.length - 2);
                    sendingObject = JSON.parse(convertedStr);
                }
            } catch (e) {
            }

            if (_.isEmpty(sendingObject)) {
                console.log(`[Q] Invalid json data: ${str}`);
                callBack('success'); // Delete job
                return;
            }
        }


        this.mailSender
            .send(sendingObject)
            .then(res => {
                callBack('success');
            })
            .catch(err => {
                console.log('[Q] Send mail failed: ' + err.message);
                // callBack('success');
                callBack('burry');
            })
    }
}

module.exports = MailWorker;