var generate_cat_array = require('./../cats/generate_cat_array');
var generate_cat_info = require('./../cats/generate_cat_info');

module.exports = function gen_cat_par(params){

  var cat_data = {};
  cat_data.row = generate_cat_array(params, 'row');
  cat_data.col = generate_cat_array(params, 'col');

  cat_data.cat_num = {};
  cat_data.cat_num.row = cat_data.row.length;
  cat_data.cat_num.col = cat_data.col.length;

  var cat_room = {};
  cat_room.webgl = 0.0135;
  cat_room.x = cat_room.webgl;
  cat_room.y = cat_room.webgl;
  cat_data.cat_room = cat_room;

  cat_data.showing_color_picker = false

  params.cat_data = cat_data;

  // console.log('******************')
  // console.log(params.cat_data)
  // console.log('******************')

  // initialize category
  ////////////////////
  // cgm.params.network.col_nodes.forEach((x)=> tmp[x.name.split(': ')[1]] = x['cat-0'].split(': ')[1] )

  generate_cat_info(params);

};