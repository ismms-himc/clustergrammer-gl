var calc_row_and_col_canvas_positions = require('./calc_row_and_col_canvas_positions');
var gather_text_triangles = require('./../matrix_labels/gather_text_triangles');
var calc_viz_dim = require('./calc_viz_dim');
var ini_zoom_data = require('./../zoom/ini_zoom_data');
var ini_zoom_restrict = require('./../zoom/ini_zoom_restrict');
var zoom_rules_high_mat = require('./../zoom/zoom_rules_high_mat');
var make_cameras = require('./../cameras/make_cameras');
var calc_spillover_triangles = require('./../spillover/calc_spillover_triangles');
var make_matrix_args = require('./../matrix_cells/make_matrix_args');
var make_dendro_args = require('./../dendrogram/make_dendro_args');
var make_spillover_args = require('./../spillover/make_spillover_args');
var calc_viz_area = require('./calc_viz_area');
var calc_row_downsampled_mat = require('./../matrix_cells/calc_row_downsampled_mat');
var make_cat_args = require('./../cats/make_cat_args');
var generate_cat_data = require('./../cats/generate_cat_data');
var get_ordered_labels = require('./../matrix_labels/get_ordered_labels');
var make_tooltip_background_args = require('./../tooltip/make_tooltip_background_args');
var make_cat_position_array = require('./../cats/make_cat_position_array');
var calc_alpha_order = require('./calc_alpha_order');
var make_label_queue = require('./../matrix_labels/make_label_queue');
var calc_text_offsets = require('./../matrix_labels/calc_text_offsets');
var animation_params = require('./animation_params');

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

  animation_params(params);

  params.initialize_viz = true;
  params.first_frame = true;

  // use data from network
  //////////////////////////
  params.network = network;

  calc_alpha_order(params)

  var zoom_function = function(context){
    return context.view;
  };

  params.zoom_function = zoom_function;
  params.still_interacting = false;
  params.still_mouseover = false;
  params.mat_data = params.network.mat;

  /*
  Working on resizing the matrix, need to have separte x and y sizes
  */
  params.mat_size = {};
  params.mat_size.x = 0.80;
  params.mat_size.y = 0.80;

  params.cat_data = {};
  params.cat_data.row = generate_cat_data(params, 'row');
  params.cat_data.col = generate_cat_data(params, 'col');


  params.cat_num = {};
  params.cat_num.row = params.cat_data.row.length;
  params.cat_num.col = params.cat_data.col.length;

  params.cat_room = {};
  params.cat_room.x = 0.015;
  params.cat_room.y = 0.015;

  params.heat_size = {};
  params.heat_size.x = params.mat_size.x - params.cat_room.x * params.cat_num.row;
  params.heat_size.y = params.mat_size.y - params.cat_room.y * params.cat_num.col;

  params.num_row = params.mat_data.length;
  params.num_col = params.mat_data[0].length;

  params.tile_width = (params.heat_size.x/0.5)/params.num_col;
  params.tile_height = (params.heat_size.y/0.5)/params.num_row;

  params.center = {};
  params.center.x = 0.5;
  params.center.y = 0.5;

  // will set up global offset later
  params.offcenter = {};
  var offcenter_magnitude_x = 0.075;
  var offcenter_magnitude_y = 0.075;
  params.offcenter.x = offcenter_magnitude_x;
  params.offcenter.y = offcenter_magnitude_y;

  params.shift_camera = {};
  params.shift_camera.x = -offcenter_magnitude_x;
  params.shift_camera.y = offcenter_magnitude_y;

  params.draw_labels = false;

  params.zoom_data = ini_zoom_data();

  params.interact = {};
  params.interact.total = 0;

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

  params.inst_order = {};
  params.inst_order.row = 'clust';
  params.inst_order.col = 'clust';

  params.new_order = {};
  params.new_order.row = 'clust';
  params.new_order.col = 'clust';

  params.viz_aid_tri_args = {};

  params.cat_args = {};
  params.cat_args.row = [];
  params.cat_args.col = [];

  // array positions of categories inst and new
  params.cat_arrs = {};

  params.cat_arrs.inst = {}
  params.cat_arrs.inst.row = {};
  params.cat_arrs.inst.col = {};

  params.cat_arrs.new = {}
  params.cat_arrs.new.row = {};
  params.cat_arrs.new.col = {};

  _.each(['row', 'col'], function(inst_axis){
    for (var cat_index = 0; cat_index < params.cat_num[inst_axis]; cat_index++) {
      params.cat_arrs.inst[inst_axis][cat_index] = make_cat_position_array(params, inst_axis, cat_index, params.inst_order[inst_axis]);
      params.cat_arrs.new[inst_axis][cat_index] = make_cat_position_array(params, inst_axis, cat_index, params.new_order[inst_axis]);
      params.cat_args[inst_axis][cat_index] = make_cat_args(regl, params, inst_axis, cat_index);
    }
  });

  params.labels = {};
  params.labels.offset_dict = {};

  calc_text_offsets(params, 'row');
  calc_text_offsets(params, 'col');

  params.dendro_args = {};
  params.dendro_args.row = make_dendro_args(regl, params, 'row');
  params.dendro_args.col = make_dendro_args(regl, params, 'col');

  var spillover_args = {};

  // inst_depth is passed to spillover rects
  // var inst_color = [0, 0, 0, 0.02];
  var inst_color = [1, 1, 1, 1];

  params.spill_depth = {};
  params.spill_depth.mat_sides = 0.5;
  spillover_args.mat_sides = make_spillover_args(regl,
                                                 params.spill_depth.mat_sides,
                                                 inst_color);

  params.spill_depth.cats = 0.5;
  spillover_args.cats = make_spillover_args(regl,
                                                 params.spill_depth.cats,
                                                 inst_color);

  params.spill_depth.mat_corners = 0.2;
  spillover_args.mat_corners = make_spillover_args(regl,
                                                   params.spill_depth.mat_corners,
                                                   inst_color);
  params.spill_depth.label_corners = 0.001;
  spillover_args.label_corners = make_spillover_args(regl,
                                                     params.spill_depth.label_corners,
                                                     inst_color);

  params.spillover_args = spillover_args;

  params.show_tooltip = false;

  // the default is to remove the tooltip
  params.remove_tooltip_frame = true;

  params.in_bounds_tooltip = false;
  params.tooltip = {};
  params.tooltip.background_opacity = 0.75;
  // make tooltip args
  params.tooltip_args = make_tooltip_background_args(regl, params, 0.0001, [0, 0, 0, params.tooltip.background_opacity]);

  params.viz_dim = calc_viz_dim(regl, params);

  var pix_to_webgl = {};

  var mat_width = params.viz_dim.heat.width;
  var mat_height = params.viz_dim.heat.height;

  params.tile_pix_width = params.viz_dim.heat.width/params.num_col;
  params.tile_pix_height = params.viz_dim.heat.height/params.num_row;

  pix_to_webgl.x = d3.scale.linear();
  pix_to_webgl.x
    .domain([0, mat_width])
    .range([-0.5, 0.5])
    .clamp(true);

  pix_to_webgl.y = d3.scale.linear();
  pix_to_webgl.y
    .domain([0, mat_height])
    .range([0.5, -0.5])
    .clamp(true);

  get_ordered_labels(params);

  make_label_queue(params);

  params.mouseover = {};
  params.mouseover.row_name = null;
  params.mouseover.col_name = null;

  params.mouseover.text_triangles = {};

  params.pix_to_webgl = pix_to_webgl;


  params.text_zoom = {};

  // text zooming info
  params.text_zoom.row = {};
  params.text_zoom.row.scaled_num = params.num_row;
  params.text_zoom.row.reference = params.text_zoom.row.scaled_num;
  params.text_zoom.row.factor = 1;
  params.text_zoom.row.max_webgl_fs = 0.05;

  params.text_zoom.col = {};
  params.text_zoom.col.scaled_num = params.num_col;
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
    if (params['num_' + inst_axis] > params.max_num_text){
      params.text_triangles.draw[inst_axis] = false;
    } else {
      gather_text_triangles(params, inst_axis);
    }
  });


  // console.log('row_text_triangles in initialize_params')
  // console.log(params.row_text_triangles)

  // have max zoom restricted by column number in a similar manner to
  // how col viz aid triangle restricted zooming in previous version

  var min_dim;
  if (params.num_col < params.num_row){
    min_dim = params.num_col;
  } else {
    min_dim = params.num_row;
  }

  params.max_zoom = min_dim/4.0;
  params.zoom_restrict = ini_zoom_restrict(params);

  // update zoom_data
  zoom_rules_high_mat(regl, params);

  make_cameras(regl, params);

  params.spillover_triangles = calc_spillover_triangles(params);

  // window.addEventListener('resize', params.cameras.mat.resize);
  // window.addEventListener('resize', params.cameras['row-labels'].resize);

  // generate matrix_args using buffers
  params.matrix_args = make_matrix_args(regl, params);

  // 1 no zooming allowed, 3 is good value, 10 allows zooming
  // rc_two_cats: 3
  // mnist: 7
  var allow_factor = d3.scale.linear()
    .domain([10, 1000])
    .range([2, 30]);

  params.allowable_zoom_factor = {};
  params.allowable_zoom_factor.col = allow_factor(params.num_col);
  params.allowable_zoom_factor.row = allow_factor(params.num_col);

  params.text_scale = {};

  // save category colors
  params.cat_colors = params.network.cat_colors;

  return params;

};