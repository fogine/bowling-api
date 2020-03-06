const Resource = require('serviser-restfulness').Resource;
const constants = require('../constants.js');

module.exports = new Resource({
    singular: 'frame',
    plural: 'frames',
    db: {
        table: 'frame'
    },
    timestamps: false,
    properties: {
        player_id: {$ref: 'player.id'},
    },
    responseProperties: {
        id: {type: 'integer', minimum: 1, maximum: constants.PG_MAX_INT},
        score: {type: 'integer', minimum: 0, maximum: 30},
        throw_1: {type: 'integer', minimum: 0, maximum: constants.THROW_MAXIMUM_SCORE},
        throw_2: {type: 'integer', minimum: 0, maximum: constants.THROW_MAXIMUM_SCORE},
        game_id: {$ref: 'game.id'},
        player_id: {$ref: 'player.id'},
        is_strike: {type: 'boolean'},
        is_spare: {type: 'boolean'}
    }
});
