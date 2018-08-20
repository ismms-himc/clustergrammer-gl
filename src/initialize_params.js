var calc_row_and_col_canvas_positions = require('./calc_row_and_col_canvas_positions');
var calc_row_text_triangles = require('./calc_row_text_triangles');
var calc_col_text_triangles = require('./calc_col_text_triangles');
var calc_viz_dim = require('./calc_viz_dim');
var ini_zoom_data = require('./ini_zoom_data');
var ini_zoom_restrict = require('./ini_zoom_restrict');
var zoom_rules_high_mat = require('./zoom_rules_high_mat');
var make_cameras = require('./make_cameras');
var calc_spillover_triangles = require('./calc_spillover_triangles');
var make_matrix_args = require('./make_matrix_args');
var make_viz_aid_tri_args = require('./make_viz_aid_tri_args');
var make_cat_args = require('./make_cat_args');
var make_dendro_args = require('./make_dendro_args');
var make_spillover_args = require('./make_spillover_args');
var calc_viz_area = require('./calc_viz_area');
var calc_row_downsampled_mat = require('./calc_row_downsampled_mat');
var generate_cat_data = require('./generate_cat_data');
var get_ordered_labels = require('./get_ordered_labels');
var make_tooltip_background_args = require('./make_tooltip_background_args');

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

  // animation params
  params.animation = {};
  params.animation.time_remain = 0;
  params.animation.loop = params.time % 5

  params.animation.running = false;
  params.animation.run_switch = false;

  params.animation.last_switch_time = 0;
  params.animation.switch_duration = 3;

  params.initialize_viz = true;
  params.first_frame = true;

  // use data from network
  //////////////////////////
  params.network = network;

  var zoom_function = function(context){
    return context.view;
  };

  params.zoom_function = zoom_function;
  params.still_interacting = false;
  params.still_mouseover = false;
  params.mat_data = network.mat;

  /*
  Working on resizing the matrix, need to have separte x and y sizes
  */
  params.mat_size = {};
  params.mat_size.x = 0.7;
  params.mat_size.y = 0.7;

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
  offcenter_magnitude_x = 0.0;
  offcenter_magnitude_y = 0.0;
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

  params.inst_order = {};
  params.inst_order.row = 'clust';
  params.inst_order.col = 'clust';

  params.new_order = {};
  params.new_order.row = 'clust';
  params.new_order.col = 'clust';


  params.viz_aid_tri_args = {};
  params.viz_aid_tri_args.row = make_viz_aid_tri_args(regl, params, 'row');
  // params.viz_aid_tri_args.col = make_viz_aid_tri_args(regl, params, 'col');

  // console.log(_.keys(params.network.cat_colors['col']).length)

  //

  params.cat_args = {};
  params.cat_args.row = [];
  for (var cat_index = 0; cat_index < params.cat_num.row; cat_index++) {
    params.cat_args.row[cat_index] = make_cat_args(regl, params, 'row', cat_index=cat_index);
  }

  params.cat_args.col = [];

  for (var cat_index = 0; cat_index < params.cat_num.col; cat_index++) {
    params.cat_args.col[cat_index] = make_cat_args(regl, params, 'col', cat_index=cat_index);
  }



  params.dendro_args = {};
  params.dendro_args.row = make_dendro_args(regl, params, 'row');
  params.dendro_args.col = make_dendro_args(regl, params, 'col');

  var spillover_args = {};

  // inst_depth is passed to spillover rects
  var inst_color = [1, 0, 0, 0.25];
  // var inst_color = [1, 1, 1, 1];

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

  params.text_zoom.col = {};
  params.text_zoom.col.scaled_num = params.num_col;
  params.text_zoom.col.reference = params.text_zoom.col.scaled_num;
  params.text_zoom.col.factor = 1;

  // font_detail range: min ~12 max ~200
  ////////////////////////////////////////
  // usable range: 14-30 (was using 25)
  params.font_detail = 20;

  calc_viz_area(params);

  params.max_num_text = 75;

  // calculate the text_triangles for all rows
  // initialize with no row_text_triangles
  if (params.num_row > params.max_num_text){
    params.row_text_triangles = false;
  } else {
    params.row_text_triangles = calc_row_text_triangles(params);
  }

  if (params.num_col > params.max_num_text){
    params.col_text_triangles = false;
  } else {
    params.col_text_triangles = calc_col_text_triangles(params);
  }


  // console.log('row_text_triangles in initialize_params')
  // console.log(params.row_text_triangles)

  // have max zoom restricted by column number in a similar manner to
  // how col viz aid triangle restricted zooming in previous version
  params.max_zoom = params.num_col/2.0;
  params.zoom_restrict = ini_zoom_restrict(params);

  // update zoom_data
  zoom_rules_high_mat(regl, params);

  params.cameras = make_cameras(regl, params);

  params.spillover_triangles = calc_spillover_triangles(params);

  window.addEventListener('resize', params.cameras.mat.resize);
  window.addEventListener('resize', params.cameras['row-labels'].resize);

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