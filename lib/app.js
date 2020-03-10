'use strict';
const moduleLoader = require('serviser').moduleLoader;
const service      = require('../index.js');
const RequestError = service.Service.error.RequestError;

//creates a http application
const app = service.buildApp('bowling');

app.on('unknown-error', function(err, errorHandler) {
    //foreign key violation
    if (err.code === '23503') {
        let resourceName = '';
        let regex = /table "(\w+)"./g;
        let match = regex.exec(err.detail);
        if (match !== null) {
            resourceName = match[1];
        }
        return errorHandler(new RequestError(`${resourceName} resource doesnt exist`));
    }
    //hand back the error processing to the application
    return errorHandler(err);
});

module.exports = service.appManager;

moduleLoader.loadModules([
    __dirname + '/routes/v1.0/'
], {
    except: []
});
