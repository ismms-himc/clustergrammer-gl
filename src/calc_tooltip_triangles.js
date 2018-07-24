module.exports = function calc_tooltip_triangles(regl, params){

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

  var pos_x = (params.zoom_data.x.cursor_position/params.viz_dim.canvas.width)*2.0;
  var pos_y = (params.zoom_data.y.cursor_position/params.viz_dim.canvas.height)*2.0;

  console.log('tooltip shift', pos_x, pos_y);

  // // trying to shift based on diff between mat and heat size
  // var inst_shift = {}
  // inst_shift.x = params.mat_size.x - params.heat_size.x;
  // inst_shift.y = params.mat_size.y - params.heat_size.y;

  var tooltip_width = 0.2;
  var tooltip_height = 0.1;

  var background_triangles = [
    {'pos': [[-1.0 + pos_x - tooltip_width, 1.0 - pos_y + tooltip_height],
             [-1.0 + pos_x,                 1.0 - pos_y],
             [-1.0 + pos_x - tooltip_width, 1.0 - pos_y]
             ]},
    {'pos': [[-1.0 + pos_x - tooltip_width, 1.0 - pos_y + tooltip_height],
             [-1.0 + pos_x,                 1.0 - pos_y + tooltip_height],
             [-1.0 + pos_x,                 1.0 - pos_y]
             ]}

  ];

  return background_triangles;

};