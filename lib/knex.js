const Knex    = require('serviser-knex');
const pg      = require('pg');
const service = require('../index.js');

// override parsing date column to Date() so that it returns strings
pg.types.setTypeParser(1184, val => val);
// select count() operations will not return strings
pg.defaults.parseInt8 = true;


module.exports = Knex({
    client: 'pg',
    connection: {
        host : service.config.getOrFail('storage:postgres:host'),
        user : service.config.getOrFail('storage:postgres:databases:main:username'),
        password : service.config.getOrFail('storage:postgres:databases:main:password'),
        database : service.config.getOrFail('storage:postgres:databases:main:db')
    }
});
