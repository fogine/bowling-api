const path         = require('path');
const service      = require('../../index.js');
const registry     = require('serviser-restfulness').Resource.registry;
const moduleLoader = service.Service.moduleLoader;

moduleLoader.loadModules([
    __dirname
], {
    except: [
        path.resolve(`${__dirname}/index.js`),//itself
    ]
});

//setup resource associations
const game = registry.getBySingularName('game');
const player = registry.getBySingularName('player');
const frame = registry.getBySingularName('frame');

player.belongsTo(game);
frame.belongsTo(game);
frame.belongsTo(player);

module.exports = registry;
