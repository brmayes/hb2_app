exports.index = function(req, res){
  res.render('index');
};

exports.document = function(req, res){
  res.render('document');
};

exports.timeline = function(req, res){
  res.render('timeline');
};

exports.map = function(req, res){
  res.render('map');
};
