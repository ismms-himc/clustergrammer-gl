/* eslint-disable */

module.exports = function calc_background_tooltip_triangles(regl, params){

  /*

  Try to get background size to change with text size

  */

  var offset_x = 2.0*(params.zoom_data.x.cursor_position/params.viz_dim.canvas.width);
  var offset_y = 2.0*(params.zoom_data.y.cursor_position/params.viz_dim.canvas.height);

  // console.log('tooltip shift', offset_x, offset_y);

  // // trying to shift based on diff between mat and heat size
  // var inst_shift = {}
  // inst_shift.x = params.viz_dim.mat_size.x - params.viz_dim.heat_size.x;
  // inst_shift.y = params.viz_dim.mat_size.y - params.viz_dim.heat_size.y;

  var tooltip_width = 0.5;
  var tooltip_height = 0.1;

  var background_triangles = [
    {'pos': [[-1.0 + offset_x - tooltip_width, 1.0 - offset_y + tooltip_height],
             [-1.0 + offset_x,                 1.0 - offset_y],
             [-1.0 + offset_x - tooltip_width, 1.0 - offset_y]
             ]},
    {'pos': [[-1.0 + offset_x - tooltip_width, 1.0 - offset_y + tooltip_height],
             [-1.0 + offset_x,                 1.0 - offset_y + tooltip_height],
             [-1.0 + offset_x,                 1.0 - offset_y]
             ]}

  ];

  return background_triangles;

};