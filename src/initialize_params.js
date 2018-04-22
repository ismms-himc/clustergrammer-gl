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
var make_dendro_args = require('./make_dendro_args');
var make_spillover_args = require('./make_spillover_args');
var calc_viz_area = require('./calc_viz_area');
var calc_row_downsampled_mat = require('./calc_row_downsampled_mat');

/*
  Working on using subset of math.js for matrix splicing
*/
var core = require('mathjs/core');
var math = core.create();

math.import(require('mathjs/lib/function/probability/factorial'));

// console.log(math)

module.exports = function initialize_params(regl, network){

  var params = {};

  // use data from network
  //////////////////////////
  params.network = network;

  var zoom_function = function(context){
    return context.view;
  };

  params.zoom_function = zoom_function;
  params.still_interacting = false;
  params.mat_data = network.mat;

  /*
  Working on resizing the matrix
  */
  params.mat_size = 0.7;

  params.num_row = params.mat_data.length;
  params.num_col = params.mat_data[0].length;

  // calculate row/col canvas positions
  params.canvas_pos = calc_row_and_col_canvas_positions(params);

  // calc row-downsampled matrix
  var run_downsampling = false;
  params.is_downsampled = false;
  calc_row_downsampled_mat(params, run_downsampling);

  params.viz_aid_tri_args = {};
  params.viz_aid_tri_args.row = make_viz_aid_tri_args(regl, params, 'row');
  params.viz_aid_tri_args.col = make_viz_aid_tri_args(regl, params, 'col');

  params.dendro_args = {};
  params.dendro_args.row = make_dendro_args(regl, params, 'row');
  params.dendro_args.col = make_dendro_args(regl, params, 'col');

  var spillover_args = {};

  // inst_depth is passed to spillover rects
  var inst_color = [1, 0, 0, 0.2];
  // var inst_color = [1, 1, 1, 1];
  spillover_args.mat_sides = make_spillover_args(regl, zoom_function, 0.5, inst_color);
  spillover_args.mat_corners = make_spillover_args(regl, zoom_function, 0.4, inst_color);
  spillover_args.label_corners = make_spillover_args(regl, zoom_function, 0.0, inst_color);

  params.spillover_args = spillover_args;

  params.viz_dim = calc_viz_dim(regl, params);

  params.zoom_data = ini_zoom_data();

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
  params.font_detail = 15;

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
    .range([2, 10]);

  params.allowable_zoom_factor = allow_factor(params.num_col);

  params.text_scale = {};

  // save category colors
  params.cat_colors = params.network.cat_colors;

  return params;

};