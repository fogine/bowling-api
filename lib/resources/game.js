const Resource = require('serviser-restfulness').Resource;
const constants = require('../constants.js');

module.exports = new Resource({
    singular: 'game',
    plural: 'games',
    db: {
        table: 'game'
    },
    timestamps: true,
    properties: {},
    responseProperties: {
        id: {type: 'integer', minimum: 1, maximum: constants.PG_MAX_INT},
        created_at: {
            type: 'string',
            format: 'date-time',
            maxLength: 64
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            maxLength: 64
        }
    }
});
