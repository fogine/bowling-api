'use strict';
const appManager = require('../../../app.js');

const games = appManager.get('bowling').buildRestfulRouter({
    version: 1.0,
    url: '/api/{version}/@games'
});

//Route definitions
//since the following endpoints are Restful CRUD operations and they dont
//need any custom logic, the route business logic is implemented
//with serviser-restfulness plugin in deterministic manner, no need for manual
//labor :)
//https://github.com/lucid-services/serviser-restfulness

games.post('/', { sdkMethodName: 'createGame' });
games.get('/', { summary: 'Browse played games' });
games.get('/:{key}');
games.post('/:{key}/@players', { sdkMethodName: 'createGamePlayer' });
games.get('/:{key}/@players', { summary: "list game's players" });
games.get('/:{key}/@frames', { summary: "get game's frames" });
games.get('/:{key}/@frames/:{key}');

module.exports = games;
