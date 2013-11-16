/* This file maps your route matches
 * to functions defined in various
 * controller classes
 */

app = module.parent.exports.app;
db = module.parent.exports.db;

// controllers
var pagesCtrl = require('../app/controllers/pages');
var assetsCtrl = require('../app/controllers/assets');
var libsCtrl = require('../app/controllers/libs');

// home page
app.get('/', pagesCtrl.home);
app.get('/partials/:name', pagesCtrl.partials);

// assets
app.get('/assets', assetsCtrl.list(db));
app.post('/assets', assetsCtrl.create(db));

// libs
app.get('/libs', libsCtrl.list(db));
app.post('/libs', libsCtrl.create(db));
