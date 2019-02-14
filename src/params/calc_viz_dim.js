var extend = require('xtend/mutable');

module.exports = function calc_vd(regl, params){

  var vd = {};

  // canvas
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


  var axis = {};
  axis.x = 'row';
  axis.y = 'col';
  var dim = {};
  dim.x = 'width';
  dim.y = 'height';

  vd.mat = {};
  vd.heat = {};
  vd.heat_size = {};
  vd.center = {};
  var mat_size = {};
  var offset_heat = {};
  var inst_label;
  var inst_dim;
  _.each(['x', 'y'], function(inst_axis){

    inst_label = axis[inst_axis];
    inst_dim = dim[inst_axis];

    mat_size[inst_axis] = 0.8;

    vd.heat_size[inst_axis] = mat_size[inst_axis] -
                              params.cat_data.cat_room[inst_axis] *
                              params.cat_data.cat_num[inst_label];

    // square matrix size set by width of canvas
    vd.mat[inst_dim] = mat_size[inst_axis] * vd.canvas[inst_dim]

    // min and max position of matrix
    vd.mat[inst_axis] = {};
    vd.mat[inst_axis].min = vd.canvas[inst_dim]/2 - vd.mat[inst_dim]/2;
    vd.mat[inst_axis].max = vd.canvas[inst_dim]/2 + vd.mat[inst_dim]/2;

    vd.heat[inst_dim] = vd.heat_size[inst_axis] * vd.canvas[inst_dim]

    // // min and max position of matrix
    // offset_heat.x = (vd.mat.width - vd.heat.width)/2;
    // vd.heat.x = {};
    // vd.heat.x.min = vd.canvas.width/2 - vd.heat.width/2 + offset_heat.x;
    // vd.heat.x.max = vd.canvas.width/2 + vd.heat.width/2; //  + offset_heat.x;

    // offset_heat.y = (vd.mat.height - vd.heat.height)/2;
    // vd.heat.y = {};
    // vd.heat.y.min = vd.canvas.height/2 - vd.heat.height/2 + offset_heat.y;
    // vd.heat.y.max = vd.canvas.height/2 + vd.heat.height/2 + offset_heat.y;

    offset_heat[inst_axis] = (vd.mat[inst_dim] - vd.heat[inst_dim])/2;
    vd.heat[inst_axis] = {};
    vd.heat[inst_axis].min = vd.canvas[inst_dim]/2 - vd.heat[inst_dim]/2 + offset_heat[inst_axis];

    // need to figure out if this is necessary
    if (inst_axis == 'x'){
      vd.heat[inst_axis].max = vd.canvas[inst_dim]/2 + vd.heat[inst_dim]/2; //  + offset_heat.x;
    } else {
      vd.heat[inst_axis].max = vd.canvas[inst_dim]/2 + vd.heat[inst_dim]/2; + offset_heat.x;
    }


  });

  vd.mat_size = mat_size;


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