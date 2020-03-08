'use strict'

const service = require('serviser');
const router    = require('../router.js');
const resources = require('../../../../resources');
const constants = require('../../../../constants.js');

const RequestError = service.error.RequestError;
const Frame = resources.getBySingularName('frame');
const Player = resources.getBySingularName('player');

const route = router.buildRoute({
    type: 'post',
    url : '/:id/throw/:score',
    summary: "save player's score per frame per throw",
    sdkMethodName: 'setFrameThrowScore'
});

route.respondsWith({
    type: 'object',
    additionalProperties: false,
    properties: {
        overall_score: {type: 'integer', min: 0, max: 300}
    }
});

route.respondsWith(new service.error.RequestError({apiCode: API_CODES.FRAME_THROW_OVERFLOW}));
route.respondsWith(new service.error.RequestError({apiCode: API_CODES.FRAME_NOT_FOUND}));

route.validate({
    required: ['id'],
    properties: {
        id: {$ref: 'frame.id'},
        score: {$ref: 'frame.throw_1'},
    }
}, 'params');

route.step('save-current-throw-score', async function (req, res) {
    this.knex = this.app.resourceManager.get('knex');
    this.frame_id = req.params.id;

    const data = {};
    const current_score = req.params.score;

    //retrieve frame record
    const frame = await Frame.query(this.knex).where('id', this.frame_id).first();
    this.frame = frame;

    if (!frame) {

        throw new RequestError({
            apiCode: API_CODES.FRAME_NOT_FOUND
        });
    }

    //save the throw score and determine whether its strike,spare or open frame
    if (frame.throw_1 == null) {

        data.throw_1 = current_score;

        if (current_score == constants.THROW_MAXIMUM_SCORE) {
            data.is_strike = true;
        }

    } else if (frame.throw_2 == null && !frame.is_strike) {

        data.throw_2 = current_score;

        if ((frame.throw_1 + current_score) == constants.THROW_MAXIMUM_SCORE) {
            data.is_spare = true;
        } else {
            //no strike nor spare. we know total score for the frame
            data.score = frame.throw_1 + current_score;
        }

    } else {

        throw new RequestError({
            message: 'The frame is locked as there are no throw attempts remaining.',
            apiCode: API_CODES.FRAME_THROW_OVERFLOW
        });
    }

    return Frame.query(this.knex).where('id', this.frame_id).update(data);
});

route.step('set-strike-or-spare-score', async function(req, res) {
    const framesForUpdate = [];
    const frames = await Frame.query(this.knex)
        .where('player_id', this.frame.player_id)
        .andWhere('game_id', '=', this.frame.game_id)
        .andWhere('id', '<=', this.frame.id)
        .orderBy('id', 'desc')
        .limit(3)
        .select();

    //iterate over last 3 frames from oldest to newest frame
    //and calculate frame scores for strikes and spares where there is enough data
    frames.reverse().forEach(function(frame, index, array) {

        let secondFrame = array[index+1];
        let thirdFrame = array[index+2];

        if (frame.score !== null || !secondFrame) {
            return;
        }

        if (frame.is_spare) {

            framesForUpdate.push({
                id: frame.id,
                score: frame.throw_1 + frame.throw_2 + secondFrame.throw_1
            });

        } else if (frame.is_strike) {

            if (!secondFrame.is_strike
                && secondFrame.throw_1 !== null
                && secondFrame.throw_2 !== null
            ) {

                framesForUpdate.push({
                    id: frame.id,
                    score: frame.throw_1 + secondFrame.throw_1 + secondFrame.throw_2
                });

            } else if (secondFrame.is_strike && thirdFrame) {

                framesForUpdate.push({
                    id: frame.id,
                    score: frame.throw_1 + secondFrame.throw_1 + thirdFrame.throw_1
                });
            }
        }
    });

    //update frame data in db
    return this.knex.transaction(function(trx) {
        const queries = framesForUpdate.map(frame => {
            return trx(Frame.getTableName())
                .where('id', frame.id)
                .update(frame)
        }, this);

        return Promise.all(queries);
    });
});

route.step('update-players-overall-score', async function(req, res) {
    const totalCurrentScore = (await Frame.query(this.knex)
        .where('game_id', this.frame.game_id)
        .andWhere('player_id', this.frame.player_id)
        .sum('score'))[0].sum;

    if (totalCurrentScore) {
        await Player.query(this.knex).where('id', this.frame.player_id).update({
            score: totalCurrentScore
        });
    }

    res.json({});
});
