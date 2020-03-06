'use strict';
const appManager = require('../../../app.js');

const players = appManager.get('bowling').buildRestfulRouter({
    version: 1.0,
    url: '/api/{version}/@players'
});

//Route definitions

players.get('/:{key}');

module.exports = players;
