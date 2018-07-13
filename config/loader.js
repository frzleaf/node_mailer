require('./builtin');
global._ = require('lodash');

global._config = require('./config');
global.Q = require('q');

global.D = function () {
    return Q.defer();
};