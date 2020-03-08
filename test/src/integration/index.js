const Promise         = require('bluebird');
const chai            = require('chai');
const chaiAsPromised  = require('chai-as-promised');
const Service         = require('serviser');
const path            = require('path');
const config          = require('serviser-config');

const ServiceSDK = require('../sdk.js');

chai.use(chaiAsPromised);
chai.should();

Object.defineProperty(global, 'Promise', {
    configurable: false,
    writable: false,
    value: Promise
});

describe('integration tests', function() {
    before(function() {
        const self = this;
        config.initialize();

        this.service = require('../../../index.js');

        return this.service.listen().then(function() {
            const app = self.service.appManager.get('bowling');
            let port = app.server.address().port;

            self.port = port;
            self.sdk = new ServiceSDK({
                baseURL: `http://127.0.0.1:${port}`,
                headers: {
                    'content-type': 'application/json'
                }
            });
        });
    });

    after(function() {
        return this.service.close().then(function() {
            process.exit(0);
        });
    });

    loadTestFiles();

    /**
     * @return {undefined}
     */
    function loadTestFiles() {
        //load (and execute) all test files in the current directory except itself
        Service.moduleLoader.fileIterator([
            path.resolve(`${__dirname}/`),
        ], {
            except: [
                path.resolve(`${__dirname}/index.js`),//itself
            ]
        }, function(file, dir) {
            if (require.extensions[path.extname(file)]) {
                let p = path.join(dir, file);
                return require(p);
            }
        });
    }

});
