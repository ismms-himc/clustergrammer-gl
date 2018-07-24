module.exports = function calc_tooltip_triangles(regl, params){

  var viz_dim = params.viz_dim;

  var ini_mat = params.mat_size;
  var ini_heat = params.heat_size;

  var height_to_width = viz_dim.canvas.height/viz_dim.canvas.width;

  var scaled_mat = {};
  scaled_mat.x = ini_mat.x / height_to_width;
  scaled_mat.y = ini_mat.y / height_to_width;

  var scaled_heat = {};
  scaled_heat.x = ini_heat.x / height_to_width;
  scaled_heat.y = ini_heat.y / height_to_width;

  var spillover_triangles = {};

  // trying to shift based on diff between mat and heat size
  var inst_shift = {}
  inst_shift.x = params.mat_size.x - params.heat_size.x;
  inst_shift.y = params.mat_size.y - params.heat_size.y;

  var background_triangles = [
    // top-left spillover rect
    {'pos': [[-1, 1],
             [-0.8 , 0.8],
             [-1.0 , 0.8]
             ]},
    {'pos': [[-1.0, 1.0],
             [-0.8, 1.0],
             [-0.8, 0.8]
             ]}

  ];

  return background_triangles;

};