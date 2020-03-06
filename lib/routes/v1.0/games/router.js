'use strict';
const appManager = require('../../../app.js');

const games = appManager.get('bowling').buildRestfulRouter({
    version: 1.0,
    url: '/api/{version}/@games'
});

//Route definitions

games.post('/', { sdkMethodName: 'createGame' });
games.get('/', { summary: 'Browse played games' });
games.get('/:{key}');
games.post('/:{key}/@players', { sdkMethodName: 'createGamePlayer' });
games.get('/:{key}/@players', { summary: "list game's players" });
games.get('/:{key}/@frames', { summary: "get game's frames" });
games.get('/:{key}/@frames/:{key}');
games.post('/:{key}/@frames', {
    sdkMethodName: 'createGameFrame',
    summary: 'initiate new frame (round)'
});

module.exports = games;
