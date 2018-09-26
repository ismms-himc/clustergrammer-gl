var calc_row_and_col_canvas_positions = require('./calc_row_and_col_canvas_positions');
var gather_text_triangles = require('./../matrix_labels/gather_text_triangles');
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
var animation_params = require('./animation_params');
var generate_cat_params = require('./generate_cat_params');
var generate_label_params = require('./generate_label_params');
var generate_interact_params = require('./generate_interact_params');
var generate_order_params = require('./generate_order_params');
var generate_spillover_params = require('./generate_spillover_params');

// /*
//   Working on using subset of math.js for matrix splicing
// */
// var core = require('mathjs/core');
// var math = core.create();

// math.import(require('mathjs/lib/function/probability/factorial'));

// console.log(math)

module.exports = function initialize_params(regl, network){

  var params = {};

  params.time = 0;
  params.viz_interact = true;
  params.initialize_viz = true;
  params.first_frame = true;

  animation_params(params);

  // use data from network
  //////////////////////////
  params.network = network;

  calc_alpha_order(params)

  generate_interact_params(params);

  var zoom_function = function(context){
    return context.view;
  };

  params.zoom_function = zoom_function;
  params.mat_data = params.network.mat;

  generate_cat_params(params);

  /*
  Working on resizing the matrix, need to have separte x and y sizes
  */

  calc_viz_dim(regl, params);
  generate_order_params(params);
  generate_label_params(params);

  params.viz_dim.tile_width = (params.viz_dim.heat_size.x/0.5)/params.labels.num_col;
  params.viz_dim.tile_height = (params.viz_dim.heat_size.y/0.5)/params.labels.num_row;

  // will set up global offset later
  params.offcenter = {};
  var offcenter_magnitude_x = 0.075;
  var offcenter_magnitude_y = 0.075;
  params.offcenter.x = offcenter_magnitude_x;
  params.offcenter.y = offcenter_magnitude_y;

  params.shift_camera = {};
  params.shift_camera.x = -offcenter_magnitude_x;
  params.shift_camera.y = offcenter_magnitude_y;

  params.zoom_data = ini_zoom_data();

  // calculate row/col canvas positions
  params.canvas_pos = calc_row_and_col_canvas_positions(params);

  // save text triangles for later use
  params.text_triangles = {};
  params.text_triangles.row = {};
  params.text_triangles.col = {};

  // calc row-downsampled matrix
  var run_downsampling = false;
  params.is_downsampled = false;
  calc_row_downsampled_mat(params, run_downsampling);

  params.viz_aid_tri_args = {};

  params.cat_args = {};
  params.cat_args.row = [];
  params.cat_args.col = [];

  // array positions of categories inst and new
  params.cat_arrs = {};
  _.each(['inst', 'new'], function(inst_state){

    params.cat_arrs[inst_state] = {}
    params.cat_arrs[inst_state].row = {};
    params.cat_arrs[inst_state].col = {};

  });

  _.each(['row', 'col'], function(inst_axis){
    for (var cat_index = 0; cat_index < params.cat_data.cat_num[inst_axis]; cat_index++) {
      params.cat_arrs.inst[inst_axis][cat_index] = make_cat_position_array(params, inst_axis, cat_index, params.order.inst[inst_axis]);
      params.cat_arrs.new[inst_axis][cat_index] = make_cat_position_array(params, inst_axis, cat_index, params.order.new[inst_axis]);
      params.cat_args[inst_axis][cat_index] = make_cat_args(regl, params, inst_axis, cat_index);
    }
  });


  calc_text_offsets(params, 'row');
  calc_text_offsets(params, 'col');

  params.dendro_args = {};
  params.dendro_args.row = make_dendro_args(regl, params, 'row');
  params.dendro_args.col = make_dendro_args(regl, params, 'col');

  generate_spillover_params(regl, params);

  params.show_tooltip = false;

  // the default is to remove the tooltip
  params.remove_tooltip_frame = true;

  params.in_bounds_tooltip = false;
  params.tooltip = {};
  params.tooltip.background_opacity = 0.75;
  // make tooltip args
  params.tooltip_args = make_tooltip_background_args(regl, params, 0.0001, [0, 0, 0, params.tooltip.background_opacity]);

  var pix_to_webgl = {};

  params.tile_pix_width = params.viz_dim.heat.width/params.labels.num_col;
  params.tile_pix_height = params.viz_dim.heat.height/params.labels.num_row;

  pix_to_webgl.x = d3.scale.linear();
  pix_to_webgl.x
    .domain([0, params.viz_dim.heat.width])
    .range([-0.5, 0.5])
    .clamp(true);

  pix_to_webgl.y = d3.scale.linear();
  pix_to_webgl.y
    .domain([0, params.viz_dim.heat.height])
    .range([0.5, -0.5])
    .clamp(true);

  make_label_queue(params);

  params.pix_to_webgl = pix_to_webgl;

  params.text_zoom = {};

  // text zooming info
  params.text_zoom.row = {};
  params.text_zoom.row.scaled_num = params.labels.num_row;
  params.text_zoom.row.reference = params.text_zoom.row.scaled_num;
  params.text_zoom.row.factor = 1;
  params.text_zoom.row.max_webgl_fs = 0.05;

  params.text_zoom.col = {};
  params.text_zoom.col.scaled_num = params.labels.num_col;
  params.text_zoom.col.reference = params.text_zoom.col.scaled_num;
  params.text_zoom.col.factor = 1;
  params.text_zoom.col.max_webgl_fs = 0.06;

  // font_detail range: min ~12 max ~200
  ////////////////////////////////////////
  // usable range: 14-30 (was using 25)
  params.font_detail = 20;

  calc_viz_area(params);

  params.max_num_text = 200;

  params.text_triangles.draw = {};

  _.each(['row', 'col'], function(inst_axis){
    if (params.labels['num_' + inst_axis] > params.max_num_text){
      params.text_triangles.draw[inst_axis] = false;
    } else {
      gather_text_triangles(params, inst_axis);
    }
  });

  // have max zoom restricted by column number in a similar manner to
  // how col viz aid triangle restricted zooming in previous version

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