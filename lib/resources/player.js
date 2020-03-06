const Resource = require('serviser-restfulness').Resource;
const constants = require('../constants.js');

module.exports = new Resource({
    singular: 'player',
    plural: 'players',
    db: {
        table: 'player'
    },
    timestamps: false,
    properties: {
        nickname: {
            type: 'string',
            minLength: 1,
            maxLength: 16,
            pattern:  '^[a-zA-Z0-9-_ ]+$'
        },
        game_id: {
            type: 'integer',
            minimum: 1,
            maximum: constants.PG_MAX_INT
        }
    },
    responseProperties: {
        id: {type: 'integer', minimum: 1, maximum: constants.PG_MAX_INT},
        nickname: {$ref: 'player.nickname'},
        game_id: {$ref: 'player.game_id'},
        score: {type: 'integer', minimum: 0, maximum: 300}
    }
});
