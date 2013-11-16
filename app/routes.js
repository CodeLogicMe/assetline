/* This file maps your route matches
 * to functions defined in various
 * controller classes
 */

app = module.parent.exports.app;
db = module.parent.exports.db;

// controllers
var pagesCtrl = require('../app/controllers/pages');
var assetCtrl = require('../app/controllers/assets');

// home page
app.get('/', pagesCtrl.home);
app.get('/partials/:name', pagesCtrl.render);

// assets
app.get('/assets', assetCtrl.list(db));
app.post('/assets', assetCtrl.create(db));
