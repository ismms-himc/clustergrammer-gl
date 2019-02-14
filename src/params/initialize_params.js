var calc_row_and_col_canvas_positions = require('./calc_row_and_col_canvas_positions');
var calc_viz_dim = require('./calc_viz_dim');
var ini_zoom_data = require('./../zoom/ini_zoom_data');
var ini_zoom_restrict = require('./../zoom/ini_zoom_restrict');
var zoom_rules_high_mat = require('./../zoom/zoom_rules_high_mat');
var make_cameras = require('./../cameras/make_cameras');
var make_matrix_args = require('./../matrix_cells/make_matrix_args');
var calc_viz_area = require('./calc_viz_area');
var make_label_queue = require('./../matrix_labels/make_label_queue');
var calc_text_offsets = require('./../matrix_labels/calc_text_offsets');
var generate_order_params = require('./generate_order_params');
var generate_spillover_params = require('./generate_spillover_params');
var generate_text_triangle_params = require('./generate_text_triangle_params');
var gen_pix_to_webgl = require('./gen_pix_to_webgl');
var generate_webgl_to_pix = require('./generate_webgl_to_pix');
var gen_text_zoom_par = require('./gen_text_zoom_par');
var generate_cat_args_arrs = require('./generate_cat_args_arrs');
var generate_tooltip_params = require('./generate_tooltip_params');
var gen_dendro_par = require('./gen_dendro_par');
var calc_mat_arr = require('./../params/calc_mat_arr');

module.exports = function initialize_params(regl, network){

  var params = {};
  params.network = network;

  require('./gen_ani_par')(params);
  require('./calc_alpha_order')(params)
  require('./gen_int_par')(params);
  params.mat_data = params.network.mat;
  require('./gen_cat_par')(params);
  generate_order_params(params);
  require('./gen_label_par')(params);
  calc_viz_dim(regl, params);
  generate_cat_args_arrs(regl, params);
  params.zoom_data = ini_zoom_data();
  params.canvas_pos = calc_row_and_col_canvas_positions(params);
  params.is_downsampled = false;
  params.viz_aid_tri_args = {};

  _.each(['row', 'col'], function(inst_axis){
    calc_text_offsets(params, inst_axis);
  });

  generate_tooltip_params(regl, params);
  params.tile_pix_width = params.viz_dim.heat.width/params.labels.num_col;
  params.tile_pix_height = params.viz_dim.heat.height/params.labels.num_row;

  gen_pix_to_webgl(params);
  generate_webgl_to_pix(params);
  make_label_queue(params);
  gen_text_zoom_par(params);
  calc_viz_area(params);
  generate_text_triangle_params(params);

  var min_dim;
  if (params.labels.num_col < params.labels.num_row){
    min_dim = params.labels.num_col;
  } else {
    min_dim = params.labels.num_row;
  }

  params.max_zoom = min_dim/4.0;
  params.zoom_restrict = ini_zoom_restrict(params);
  zoom_rules_high_mat(regl, params);
  make_cameras(regl, params);

  calc_mat_arr(params);
  params.matrix_args = make_matrix_args(regl, params);
  gen_dendro_par(regl, params);
  generate_spillover_params(regl, params);

  var allow_factor = d3.scale.linear()
    .domain([10, 1000])
    .range([2, 30]);

  params.allowable_zoom_factor = {};
  params.allowable_zoom_factor.col = allow_factor(params.labels.num_col);
  params.allowable_zoom_factor.row = allow_factor(params.labels.num_col);
  params.text_scale = {};
  params.cat_colors = params.network.cat_colors;

  return params;

};