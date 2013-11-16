
/*
 * GET home page.
 */

exports.home = function(req, res){
  res.render('index');
};

exports.render = function(req, res){
  res.render('partials/' + req.params.name)
};
