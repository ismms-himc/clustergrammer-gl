var calc_row_and_col_canvas_positions = require('./calc_row_and_col_canvas_positions');
var calc_viz_dim = require('./calc_viz_dim');
var ini_zoom_data = require('./../zoom/ini_zoom_data');
var ini_zoom_restrict = require('./../zoom/ini_zoom_restrict');
var zoom_rules_high_mat = require('./../zoom/zoom_rules_high_mat');
var make_cameras = require('./../cameras/make_cameras');
var make_matrix_args = require('./../matrix_cells/make_matrix_args');
var make_dendro_args = require('./../dendrogram/make_dendro_args');
var calc_viz_area = require('./calc_viz_area');
var calc_row_downsampled_mat = require('./../matrix_cells/calc_row_downsampled_mat');
var make_cat_args = require('./../cats/make_cat_args');
var make_tooltip_background_args = require('./../tooltip/make_tooltip_background_args');
var make_cat_position_array = require('./../cats/make_cat_position_array');
var calc_alpha_order = require('./calc_alpha_order');
var make_label_queue = require('./../matrix_labels/make_label_queue');
var calc_text_offsets = require('./../matrix_labels/calc_text_offsets');
var generate_animation_params = require('./generate_animation_params');
var generate_cat_params = require('./generate_cat_params');
var generate_label_params = require('./generate_label_params');
var generate_interact_params = require('./generate_interact_params');
var generate_order_params = require('./generate_order_params');
var generate_spillover_params = require('./generate_spillover_params');
var generate_text_triangle_params = require('./generate_text_triangle_params');
var generate_pix_to_webgl = require('./generate_pix_to_webgl');
var generate_text_zoom_params = require('./generate_text_zoom_params');

// /*
//   Working on using subset of math.js for matrix splicing
// */
// var core = require('mathjs/core');
// var math = core.create();
// math.import(require('mathjs/lib/function/probability/factorial'));

module.exports = function initialize_params(regl, network){

  var params = {};
  params.network = network;

  generate_animation_params(params);
  calc_alpha_order(params)
  generate_interact_params(params);

  params.mat_data = params.network.mat;


  generate_cat_params(params);

  generate_order_params(params);
  generate_label_params(params);

  calc_viz_dim(regl, params);

  // cat arrs and args
  //////////////////////////////////////////////////////////////////////////////
  params.cat_args = {};
  params.cat_args.row = [];
  params.cat_args.col = [];

  params.cat_arrs = {};

  _.each(['inst', 'new'], function(inst_state){
    params.cat_arrs[inst_state] = {}
    params.cat_arrs[inst_state].row = {};
    params.cat_arrs[inst_state].col = {};
  });

  _.each(['row', 'col'], function(inst_axis){
    for (var cat_index = 0; cat_index < params.cat_data.cat_num[inst_axis]; cat_index++) {
      _.each(['inst', 'new'], function(inst_state){
        params.cat_arrs[inst_state][inst_axis][cat_index] = make_cat_position_array(
          params, inst_axis, cat_index, params.order[inst_state][inst_axis]
        );
      });
      params.cat_args[inst_axis][cat_index] = make_cat_args(regl, params, inst_axis, cat_index);
    }
  });
  //////////////////////////////////////////////////////////////////////////////

  params.zoom_data = ini_zoom_data();


  // calculate row/col canvas positions
  params.canvas_pos = calc_row_and_col_canvas_positions(params);

  // calc row-downsampled matrix
  var run_downsampling = false;
  params.is_downsampled = false;
  calc_row_downsampled_mat(params, run_downsampling);



  params.viz_aid_tri_args = {};


  _.each(['row', 'col'], function(inst_axis){
    calc_text_offsets(params, inst_axis);
  });

  params.dendro_args = {};
  _.each(['row', 'col'], function(inst_axis){
    params.dendro_args[inst_axis] = make_dendro_args(regl, params, inst_axis);
  });

  generate_spillover_params(regl, params);

  params.show_tooltip = false;

  // the default is to remove the tooltip
  params.remove_tooltip_frame = true;

  params.in_bounds_tooltip = false;
  params.tooltip = {};
  params.tooltip.background_opacity = 0.75;
  // make tooltip args
  params.tooltip_args = make_tooltip_background_args(regl, params, 0.0001, [0, 0, 0, params.tooltip.background_opacity]);


  params.tile_pix_width = params.viz_dim.heat.width/params.labels.num_col;
  params.tile_pix_height = params.viz_dim.heat.height/params.labels.num_row;

  generate_pix_to_webgl(params);

  make_label_queue(params);

  generate_text_zoom_params(params);

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

  // update zoom_data
  zoom_rules_high_mat(regl, params);

  make_cameras(regl, params);

  // generate matrix_args using buffers
  params.matrix_args = make_matrix_args(regl, params);

  var allow_factor = d3.scale.linear()
    .domain([10, 1000])
    .range([2, 30]);

  params.allowable_zoom_factor = {};
  params.allowable_zoom_factor.col = allow_factor(params.labels.num_col);
  params.allowable_zoom_factor.row = allow_factor(params.labels.num_col);

  params.text_scale = {};

  // save category colors
  params.cat_colors = params.network.cat_colors;

  return params;

};