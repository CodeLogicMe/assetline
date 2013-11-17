/* This file maps your route matches
 * to functions defined in various
 * controller classes
 */

app = module.parent.exports.app;
db = module.parent.exports.db;

// controllers
var pagesCtrl = require('../app/controllers/pages');
var packagesCtrl = require('../app/controllers/packages');
var libsCtrl = require('../app/controllers/libs');

// home page
app.get('/', pagesCtrl.home);
app.get('/partials/:name', pagesCtrl.partials);

// packages
app.get('/packages', packagesCtrl.list(db));
app.post('/packages', packagesCtrl.create(db));

// libs
app.get('/libs', libsCtrl.list(db));
app.post('/libs', libsCtrl.create(db));
app.del('/libs/:id', libsCtrl.delete(db));
