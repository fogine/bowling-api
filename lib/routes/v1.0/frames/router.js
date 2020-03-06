'use strict';
const appManager = require('../../../app.js');

const router = appManager.get('bowling').buildRouter({
    version: 1.0,
    url: '/api/{version}/frames'
});

module.exports = router;
