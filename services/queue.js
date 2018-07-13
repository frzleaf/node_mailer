const cAsync = require('async');
const BeanstalkClient = require('./beanstalk-client');

class Queue {

    constructor(queueConfig, workers) {
        this.workers = workers;
        this.queueConfig = queueConfig;
    }

    run() {
        this.workers.map(worker => {
            const client = BeanstalkClient(this.queueConfig);
            const tubeName = worker.getName();
            client
                .on('connect', _ => {
                    client.use(tubeName, _ => {
                        console.log(`[Q] Work on tube: ${tubeName}`)
                    });
                    client.watch(tubeName, _ => {
                    });

                    this.goToWork(client, worker);
                })
                .connect();
        })
    }


    /**
     *
     */
    goToWork(client, worker) {
        cAsync.forever(
            next => {
                client.reserve((err, jobId, response) => {
                    if (jobId) {

                        const str = response.toString('utf8');

                        if (!str) {
                            console.log('Empty input data');
                            return this.clearJob(client, jobId);
                        }

                        let qObject = null;
                        console.log(str[1]);
                        try {
                            if (/^[\[\{ ].+/.test(str)) {
                                qObject = JSON.parse(str);

                            } else {
                                // PHP serialize
                                let convertedStr = str.slice(str.indexOf('"') + 1);
                                convertedStr = convertedStr.slice(0, convertedStr.length - 2);
                                qObject = JSON.parse(convertedStr);
                            }
                        } catch (e) {
                        }

                        if (_.isEmpty(qObject)) {
                            console.log(`[Q] Invalid json data: ${str}`);
                            this.clearJob(client, jobId);
                            return;
                        }

                        worker
                            .work(qObject)
                            .then(_ => {
                            });

                        this.clearJob(client, jobId);
                        next();

                    }
                    else {
                        setTimeout(function () {
                            next();
                        }, 3000);
                    }
                });
            },

            err => {
                console.log(err)
            }
        );
    }

    clearJob(client, jobId) {
        client.destroy(jobId, function (err) {
            if (err) {
                console.log(`Error while delete notification #${jobId}: ${err.message}`);
            }
        });
    }

}

module.exports = Queue;