module.exports = function calc_background_tooltip_triangles(regl, params){

  // var viz_dim = params.viz_dim;
  // var ini_mat = params.mat_size;
  // var ini_heat = params.heat_size;
  // var height_to_width = viz_dim.canvas.height/viz_dim.canvas.width;

  // var scaled_mat = {};
  // scaled_mat.x = ini_mat.x / height_to_width;
  // scaled_mat.y = ini_mat.y / height_to_width;

  // var scaled_heat = {};
  // scaled_heat.x = ini_heat.x / height_to_width;
  // scaled_heat.y = ini_heat.y / height_to_width;

  var offset_x = 2.0*(params.zoom_data.x.cursor_position/params.viz_dim.canvas.width);
  var offset_y = 2.0*(params.zoom_data.y.cursor_position/params.viz_dim.canvas.height);

  // console.log('tooltip shift', offset_x, offset_y);

  // // trying to shift based on diff between mat and heat size
  // var inst_shift = {}
  // inst_shift.x = params.mat_size.x - params.heat_size.x;
  // inst_shift.y = params.mat_size.y - params.heat_size.y;

  var tooltip_width = 0.3;
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