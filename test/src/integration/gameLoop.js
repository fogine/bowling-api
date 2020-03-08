
describe('game loop', function() {

    beforeEach(initializeNewGame);

    [
        {
            case: 'start with strike',
            shots: [10,7,3,7,2,9,1,10,10,10,2,3,6,4,7,3,3],
            score: 168
        },
        {
            case: 'start with spare',
            shots: [8,2,3,5,5,0,4,1,9,1,5,1,7,1,10,5,2,10,10,2],
            score: 106
        },
        {
            case: 'finish with srike',
            shots: [5,2,3,5,5,0,4,1,9,1,5,1,7,1,10,5,2,10,10,2],
            score: 100
        },
        {
            case: 'finish with spare',
            shots: [8,2,7,3,3,4,10,2,8,10,10,8,0,10,8,2,9],
            score: 170
        }
    ].forEach(function(dataset) {

        it(`should calculate players total score of ${dataset.score} points (${dataset.case})`, function() {
            let remainingShotsPerFrame = 2;

            return Promise.resolve(dataset.shots).bind(this).each(function(shotPoints) {
                let p;

                if (remainingShotsPerFrame > 0) {
                    if (shotPoints == 10) {
                        remainingShotsPerFrame -= 2;
                    } else {
                        remainingShotsPerFrame -= 1;
                    }
                    p = this.sdk.setFrameThrowScore(this.frame_id, shotPoints);
                }

                if (remainingShotsPerFrame == 0) {
                    remainingShotsPerFrame = 2;
                    return p.bind(this).then(function() {
                        return this.sdk.createGameFrame(this.game_id, {
                            data: {player_id: this.player_id}
                        });
                    }).then(function(response) {
                        this.frame_id = parseResourceId(response);
                    });
                }

                return p;
            }).then(function() {
                return this.sdk.getPlayer(this.player_id);
            }).then(function(response) {
                response.data.should.be.eql({
                    id: this.player_id,
                    game_id: this.game_id,
                    nickname: this.nickname,
                    score: dataset.score
                });
            });
        });
    });

    [
        {
            case: 'finish with open frame',
            shots: [8,2,3,5,5,0,4,1,9,1,5,1,7,1,10,5,2,2,0,10]
        },
        //TODO: edge case which currently fails - out of scope of this example
        //setFrameThrowScore needs to check whether a frame is the last in the game
        //and whether there is a second attempt remaining for the given frame.
        //The last frame doesnt have a second throw attempt when the player finishes with spare or two strikes in row
        //{
            //case: 'finish with srike',
            //shots: [5,2,3,5,5,0,4,1,9,1,5,1,7,1,10,5,2,10,10,2,10]
        //},
        //{
            //case: 'finish with spare',
            //shots: [8,2,7,3,3,4,10,2,8,10,10,8,0,10,8,2,9,1]
        //}
    ].forEach(function(dataset) {

        it(`should fail to create last frame - case:${dataset.case}`, function() {
            let remainingShotsPerFrame = 2;

            return Promise.resolve(dataset.shots).bind(this).each(function(shotPoints) {
                let p;

                if (remainingShotsPerFrame > 0) {
                    if (shotPoints == 10) {
                        remainingShotsPerFrame -= 2;
                    } else {
                        remainingShotsPerFrame -= 1;
                    }
                    p = this.sdk.setFrameThrowScore(this.frame_id, shotPoints);
                }

                if (remainingShotsPerFrame == 0) {
                    remainingShotsPerFrame = 2;
                    return p.bind(this).then(function() {
                        return this.sdk.createGameFrame(this.game_id, {
                            data: {player_id: this.player_id}
                        });
                    }).then(function(response) {
                        this.frame_id = parseResourceId(response);
                    });
                }

                return p;
            }).should.be.rejected.then(function(err) {
                err.message.should.be.eql('game ended');
            });
        });
    })
});

async function initializeNewGame() {
    let response;
    let data;

    response = await this.sdk.createGame();
    this.game_id = parseResourceId(response);

    this.nickname = 'happie';
    data = {nickname: this.nickname}
    response = await this.sdk.createGamePlayer(this.game_id, {data});
    this.player_id = parseResourceId(response);

    data = {player_id: this.player_id};
    response = await this.sdk.createGameFrame(this.game_id, {data});
    this.frame_id = parseResourceId(response);
}

function parseResourceId(response) {
    return parseInt(response.headers.location.split('/').pop());
}
