
/*
 * GET home page.
 */

exports.home = function(req, res){
  res.render('index');
};

exports.partials = function(req, res){
  res.render('partials/' + req.params.name)
};
