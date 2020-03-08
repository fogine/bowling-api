'use strict';
Object.defineProperty(global, 'Promise', {
    configurable: false,
    writable: false,
    value: require('bluebird')
});
global.API_CODES = require('./lib/constants.js').API_CODES;

const config  = require('serviser-config');
const Service = require('serviser').Service;

const service = module.exports = new Service(config);

service.resourceManager.register('knex', require('./lib/knex.js'));
require('./lib/resources'); //load data models

service.on('set-up', function() {
    require('./lib/app.js');
});

// serviser plugins
//Autogeneration of Service API documentation
require('serviser-doc');
