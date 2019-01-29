var generate_cat_array = require('./../cats/generate_cat_array');
var generate_cat_info = require('./../cats/generate_cat_info');

module.exports = function generate_cat_params(params){

  params.cat_data = {};
  params.cat_data.row = generate_cat_array(params, 'row');
  params.cat_data.col = generate_cat_array(params, 'col');

  params.cat_data.cat_num = {};
  params.cat_data.cat_num.row = params.cat_data.row.length;
  params.cat_data.cat_num.col = params.cat_data.col.length;

  params.cat_data.cat_room = {};
  var cat_room = 0.0135;
  params.cat_data.cat_room.x = cat_room;
  params.cat_data.cat_room.y = cat_room;

  generate_cat_info(params);

};