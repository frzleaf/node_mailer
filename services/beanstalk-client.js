const FiveBeans = require('fivebeans');


function retry(client) {

    if (client.retrieds > client.maxRetries) {
        console.log(`[Q] Reach max retries ${client.maxRetries}`);
        return
    }

    client.retrieds++;

    let time = 3000 * client.retrieds;
    console.log(`[Q] Retrying in ${time}ms`);
    sleep(time)
        .then(_ => {
            if (!client.isAlive) {
                try {
                    client.connect(e => {
                        console.log(arguments);
                    });
                } catch (e) {
                }
                retry(client);
            }
        });
}


module.exports = function (options = {}) {
    const client = new FiveBeans.client(options.host, options.port);
    client.retrieds = 0;
    client.maxRetries = 500;
    client.isAlive = false;

    client.on('connect', status => {

        client.retrieds = 0;
        client.isAlive = true;

        console.log(`[Q] Beanstalkd connected ${status || ''}`);

        client.on('close', _ => {
            console.log(`[Q] Disconnect from beanstalk ${options.host}`);
            client.isAlive = false;

            client.on('error', err => {
                // console.log(arguments);
            });

            retry(client);
        });

    });
    return client;
};