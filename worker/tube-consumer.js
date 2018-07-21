const BeanstalkdConsumer = require('fivebeans').worker;


class TubeConsumer extends BeanstalkdConsumer {

    constructor (options)
    {
        super(options);
        this.handler = options.handler;
    }

    
    runJob(jobID, job) {

        var self = this;
        var handler = this.handler;
        
        if (!handler) {
            self.emitWarning({ message: 'no handler found', id: jobID, type: job.type });
            self.buryAndMoveOn(jobID);
        }
        else {
            self.callHandler(handler, jobID, job);
        }
    }
}

module.exports = TubeConsumer;