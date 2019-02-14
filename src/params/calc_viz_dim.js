var extend = require('xtend/mutable');

module.exports = function calc_vd(regl, params){

  var vd = {};

  var mat_size = {};
  mat_size.x = 0.80;
  mat_size.y = 0.80;
  vd.mat_size = mat_size;

  var axis = {};
  axis['x'] = 'row';
  axis['y'] = 'col';

  vd.heat_size = {};
  var inst_label;
  _.each(['x', 'y'], function(inst_axis){
    inst_label = axis[inst_axis];
    vd.heat_size[inst_axis] = mat_size[inst_axis] - params.cat_data.cat_room[inst_axis] * params.cat_data.cat_num[inst_label];
  });

  // Set up vd
  ///////////////////////
  var opts = opts || {};
  var options = extend({
      element: opts.element || regl._gl.canvas,
    }, opts || {});

  var element = options.element;

  vd.canvas = {};

  _.each(['width', 'height'], function(inst_dim){
    vd.canvas[inst_dim] = Number.parseFloat(d3.select(element)
      .style(inst_dim).replace('px', ''));
  });

  // Matrix Dimensions
  /////////////////////////////
  vd.mat = {};

  // square matrix size set by width of canvas
  vd.mat.width  = mat_size.x * vd.canvas.width;
  vd.mat.height = mat_size.y * vd.canvas.height;

  // min and max position of matrix
  vd.mat.x = {};
  vd.mat.x.min = vd.canvas.width/2 - vd.mat.width/2;
  vd.mat.x.max = vd.canvas.width/2 + vd.mat.width/2;

  vd.mat.y = {};
  vd.mat.y.min = vd.canvas.height/2 - vd.mat.height/2;
  vd.mat.y.max = vd.canvas.height/2 + vd.mat.height/2;

  // Heatmap Dimensions
  //////////////////////////////
  vd.heat = {};

  // square matrix size set by width of canvas
  vd.heat.width  = vd.heat_size.x * vd.canvas.width;
  vd.heat.height = vd.heat_size.y * vd.canvas.height;

  var offset_heat = {};

  // min and max position of matrix
  offset_heat.x = (vd.mat.width - vd.heat.width)/2;
  vd.heat.x = {};
  vd.heat.x.min = vd.canvas.width/2 - vd.heat.width/2 + offset_heat.x;
  vd.heat.x.max = vd.canvas.width/2 + vd.heat.width/2; //  + offset_heat.x;

  offset_heat.y = (vd.mat.height - vd.heat.height)/2;
  vd.heat.y = {};
  vd.heat.y.min = vd.canvas.height/2 - vd.heat.height/2 + offset_heat.y;
  vd.heat.y.max = vd.canvas.height/2 + vd.heat.height/2 + offset_heat.y;

  vd.center = {};
  vd.center.x = 0.5;
  vd.center.y = 0.5;


  vd.tile_width = (vd.heat_size.x/0.5)/params.labels.num_col;
  vd.tile_height = (vd.heat_size.y/0.5)/params.labels.num_row;

  // will set up global offset later
  vd.offcenter = {};
  var offcenter_magnitude_x = 0.075;
  var offcenter_magnitude_y = 0.075;
  vd.offcenter.x = offcenter_magnitude_x;
  vd.offcenter.y = offcenter_magnitude_y;

  vd.shift_camera = {};
  vd.shift_camera.x = -offcenter_magnitude_x;
  vd.shift_camera.y = offcenter_magnitude_y;

  params.viz_dim = vd;
};