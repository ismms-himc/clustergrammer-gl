var extend = require('xtend/mutable');

module.exports = function calc_viz_dim(regl, params){

  var viz_dim = {};

  viz_dim.mat_size = {};
  viz_dim.mat_size.x = 0.80;
  viz_dim.mat_size.y = 0.80;

  viz_dim.heat_size = {};
  viz_dim.heat_size.x = viz_dim.mat_size.x - params.cat_data.cat_room.x * params.cat_data.cat_num.row;
  viz_dim.heat_size.y = viz_dim.mat_size.y - params.cat_data.cat_room.y * params.cat_data.cat_num.col;

  // Set up viz_dim
  ///////////////////////
  var opts = opts || {};
  var options = extend({
      element: opts.element || regl._gl.canvas,
    }, opts || {});

  var element = options.element;

  viz_dim.canvas = {};

  _.each(['width', 'height'], function(inst_dim){
    viz_dim.canvas[inst_dim] = Number.parseFloat(d3.select(element)
      .style(inst_dim).replace('px', ''));
  });

  // Matrix Dimensions
  /////////////////////////////
  viz_dim.mat = {};

  // square matrix size set by width of canvas
  viz_dim.mat.width  = viz_dim.mat_size.x * viz_dim.canvas.width;
  viz_dim.mat.height = viz_dim.mat_size.y * viz_dim.canvas.height;

  // min and max position of matrix
  viz_dim.mat.x = {};
  viz_dim.mat.x.min = viz_dim.canvas.width/2 - viz_dim.mat.width/2;
  viz_dim.mat.x.max = viz_dim.canvas.width/2 + viz_dim.mat.width/2;

  viz_dim.mat.y = {};
  viz_dim.mat.y.min = viz_dim.canvas.height/2 - viz_dim.mat.height/2;
  viz_dim.mat.y.max = viz_dim.canvas.height/2 + viz_dim.mat.height/2;

  // Heatmap Dimensions
  //////////////////////////////
  viz_dim.heat = {};

  // square matrix size set by width of canvas
  viz_dim.heat.width  = viz_dim.heat_size.x * viz_dim.canvas.width;
  viz_dim.heat.height = viz_dim.heat_size.y * viz_dim.canvas.height;

  var offset_heat = {};

  // min and max position of matrix
  offset_heat.x = (viz_dim.mat.width - viz_dim.heat.width)/2;
  viz_dim.heat.x = {};
  viz_dim.heat.x.min = viz_dim.canvas.width/2 - viz_dim.heat.width/2 + offset_heat.x;
  viz_dim.heat.x.max = viz_dim.canvas.width/2 + viz_dim.heat.width/2; //  + offset_heat.x;

  offset_heat.y = (viz_dim.mat.height - viz_dim.heat.height)/2;
  viz_dim.heat.y = {};
  viz_dim.heat.y.min = viz_dim.canvas.height/2 - viz_dim.heat.height/2 + offset_heat.y;
  viz_dim.heat.y.max = viz_dim.canvas.height/2 + viz_dim.heat.height/2 + offset_heat.y;

  viz_dim.center = {};
  viz_dim.center.x = 0.5;
  viz_dim.center.y = 0.5;

  params.viz_dim = viz_dim;

  params.viz_dim.tile_width = (params.viz_dim.heat_size.x/0.5)/params.labels.num_col;
  params.viz_dim.tile_height = (params.viz_dim.heat_size.y/0.5)/params.labels.num_row;

  // will set up global offset later
  params.viz_dim.offcenter = {};
  var offcenter_magnitude_x = 0.075;
  var offcenter_magnitude_y = 0.075;
  params.viz_dim.offcenter.x = offcenter_magnitude_x;
  params.viz_dim.offcenter.y = offcenter_magnitude_y;

  params.viz_dim.shift_camera = {};
  params.viz_dim.shift_camera.x = -offcenter_magnitude_x;
  params.viz_dim.shift_camera.y = offcenter_magnitude_y;

};