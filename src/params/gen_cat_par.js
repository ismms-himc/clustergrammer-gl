var generate_cat_array = require('./../cats/generate_cat_array');
var generate_cat_info = require('./../cats/generate_cat_info');

module.exports = function gen_cat_par(params){

  var cd = {};
  cd.row = generate_cat_array(params, 'row');
  cd.col = generate_cat_array(params, 'col');

  cd.cat_num = {};
  cd.cat_num.row = cd.row.length;
  cd.cat_num.col = cd.col.length;

  var cat_room = {};
  cat_room.webgl = 0.0135;
  cat_room.x = cat_room.webgl;
  cat_room.y = cat_room.webgl;
  cd.cat_room = cat_room;

  params.cat_data = cd;

  generate_cat_info(params);

};