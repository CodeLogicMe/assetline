/* This file maps your route matches
 * to functions defined in various
 * controller classes
 */
// console.log(module.parent);
app = module.parent.exports.app;
db = module.parent.exports.db;

/* require your controllers here */
var pagesCtrl = require('./controllers/pages');
var assetCtrl = require('./controllers/assets');

// home page
app.get('/', pagesCtrl.home);

// assets routes
app.get('/assets', assetCtrl.list(db));
app.post('/assets', assetCtrl.create(db));
