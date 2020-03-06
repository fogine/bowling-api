'use strict';
const moduleLoader = require('serviser').moduleLoader;
const service      = require('../index.js');

//creates a http application
service.buildApp('bowling');

module.exports = service.appManager;

moduleLoader.loadModules([
    __dirname + '/routes/v1.0/'
], {
    except: []
});
