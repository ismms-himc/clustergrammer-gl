module.exports = function calc_viz_area(params){

  var zoom_data = params.zoom_data;
  var mat_width = params.viz_dim.heat.width;
  var mat_height = params.viz_dim.heat.height;
  var pix_to_webgl = params.pix_to_webgl;

  var buffer_width = 0.0;
  var total_pan = {};
  var viz_area = {};
  var dim = {}
  var inst_dim;
  dim.x = 'width';
  dim.y = 'height';

  _.each(['x', 'y'], function(inst_axis){
    inst_dim = dim[inst_axis]

    total_pan[inst_axis + '_min'] = -zoom_data[inst_axis].total_pan_min;
    total_pan[inst_axis + '_max'] = params.viz_dim.heat[inst_dim] + zoom_data[inst_axis].total_pan_max;

    if (inst_axis == 'x'){
      viz_area[inst_axis + '_min'] = pix_to_webgl[inst_axis](total_pan[inst_axis + '_min']) - buffer_width;
      viz_area[inst_axis + '_max'] = pix_to_webgl[inst_axis](total_pan[inst_axis + '_max']) + buffer_width;
    } else {
      viz_area[inst_axis + '_min'] = pix_to_webgl[inst_axis](total_pan[inst_axis + '_max']) - buffer_width;
      viz_area[inst_axis + '_max'] = pix_to_webgl[inst_axis](total_pan[inst_axis + '_min']) + buffer_width;
    }

  });

  params.viz_area = viz_area;
};