
const service   = require('serviser');
const router    = require('../router.js');
const constants = require('../../../../constants.js');
const resources = require('../../../../resources');

const RequestError = service.error.RequestError;
const Frame = resources.getBySingularName('frame');

const route = router.post('/:{key}/@frames', {
    sdkMethodName: 'createGameFrame',
    summary: 'initiate new frame (round)'
});

route.once('after-validation-setup', function() {
    route.step('restrict-frame-count', async function restrictFrameCount(req, res) {
        this.knex = this.app.resourceManager.get('knex');

        const frames = await Frame.query(this.knex)
            .where('game_id', req.params.id)
            .andWhere('player_id', req.body.player_id)
            .orderBy('id', 'desc')
            .select();

        //frames from tenth to first
        const firstTenFrames = frames.slice(-constants.MAX_FRAME_COUNT);

        if (frames.length >= constants.MAX_FRAME_COUNT) {

            const tenthFrame = firstTenFrames[0];

            //handle edge cases where its possible to get two more frames in
            //case the player finishes with a strike or one more frame when
            //the player finishes with spare
            if (   (tenthFrame.is_strike && frames.length >= constants.MAX_FRAME_COUNT+2)
                || (tenthFrame.is_spare && frames.length >= constants.MAX_FRAME_COUNT+1)
                || (!tenthFrame.is_strike && !tenthFrame.is_spare)
            ) {
                throw new RequestError('game ended');
            }
        }
    });
})
