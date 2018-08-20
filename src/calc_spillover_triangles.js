/* eslint-disable */

module.exports = function calc_spillover_triangles(params){

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

  spillover_triangles.mat_sides = [

    // left spillover rect
    {'pos': [[-1, 1], [-ini_mat.x + params.offcenter.x, -1], [-1.0, -1]]},
    {'pos': [[-1, 1], [-ini_mat.x + params.offcenter.x,  1], [-ini_mat.x + params.offcenter.x, -1]]},

    // right spillover rect
    {'pos': [[1, 1], [ini_mat.x + params.offcenter.x, -1], [1.0, -1]]},
    {'pos': [[1, 1], [ini_mat.x + params.offcenter.x,  1], [ini_mat.x + params.offcenter.x, -1]]},

    // // top spillover rect
    {'pos': [[-ini_mat.x + params.offcenter.x, 1], [-ini_mat.x + params.offcenter.x, scaled_mat.y - params.offcenter.y], [ini_mat.x + params.offcenter.x, 1]]},
    {'pos': [[ ini_mat.x + params.offcenter.x, 1], [ini_mat.x + params.offcenter.x, scaled_mat.y - params.offcenter.y], [-ini_mat.x + params.offcenter.x, scaled_mat.y - params.offcenter.y]]},

    // // bottom spillover rect
    {'pos': [[-ini_mat.x + params.offcenter.x, -1], [-ini_mat.x + params.offcenter.x, -scaled_mat.y - params.offcenter.y], [ini_mat.x + params.offcenter.x, -1]]},
    {'pos': [[ ini_mat.x + params.offcenter.x, -1], [ini_mat.x + params.offcenter.x, -scaled_mat.y - params.offcenter.y], [-ini_mat.x + params.offcenter.x, -scaled_mat.y - params.offcenter.y]]},

  ];

  spillover_triangles.cats = [

    // col spillover rect
    {'pos': [[ini_heat.x  + inst_shift.x + params.offcenter.x, scaled_mat.y - params.offcenter.y],
             [-ini_heat.x + inst_shift.x + params.offcenter.x, scaled_heat.y - inst_shift.y - params.offcenter.y],
             [ini_heat.x  + inst_shift.x + params.offcenter.x, scaled_heat.y - inst_shift.y - params.offcenter.y]]
           },
    {'pos': [[-ini_heat.x + inst_shift.x + params.offcenter.x, scaled_mat.y - params.offcenter.y],
             [ ini_mat.x + params.offcenter.x,  scaled_mat.y - params.offcenter.y],
             [-ini_heat.x + inst_shift.x + params.offcenter.x, scaled_heat.y - inst_shift.y - params.offcenter.y]]
           },

    // col spillover rect
    {'pos': [[-ini_mat.x + params.offcenter.x, -scaled_mat.y - params.offcenter.y],
             [-ini_mat.x + params.offcenter.x, scaled_heat.y - inst_shift.y - params.offcenter.y],
             [-ini_heat.x + inst_shift.x + params.offcenter.x, scaled_heat.y - inst_shift.y - params.offcenter.y]]
           },
    {'pos': [[-ini_mat.x + params.offcenter.x,  -scaled_mat.y - params.offcenter.y],
             [ -ini_heat.x + inst_shift.x + params.offcenter.x,  -scaled_mat.y - params.offcenter.y],
             [-ini_heat.x + inst_shift.x + params.offcenter.x, scaled_heat.y - inst_shift.y - params.offcenter.y]]
           },

  ];

  spillover_triangles.mat_corners = [

    // top-left spillover rect
    {'pos': [[-1, 1],
             [-ini_heat.x + inst_shift.x + params.offcenter.x, scaled_heat.y - inst_shift.y - params.offcenter.y],
             [-1.0 , scaled_heat.y - inst_shift.y - params.offcenter.y]
             ]},
    {'pos': [[-1, 1],
             [-ini_heat.x + inst_shift.x + params.offcenter.x,  1],
             [-ini_heat.x + inst_shift.x + params.offcenter.x, scaled_heat.y - inst_shift.y - params.offcenter.y]
             ]},

    // bottom-left spillover rect
    {'pos': [[-1, -1], [-ini_mat.x + params.offcenter.x, -scaled_mat.y - params.offcenter.y], [-1.0, -scaled_mat.y - params.offcenter.y]]},
    {'pos': [[-1, -1], [-ini_mat.x + params.offcenter.x,  -1], [-ini_mat.x + params.offcenter.x, -scaled_mat.y - params.offcenter.y]]},

    // top-right spillover rect
    // mat corners
    {'pos': [[1, 1], [ini_mat.x + params.offcenter.x, scaled_mat.y - params.offcenter.y], [1.0, scaled_mat.y - params.offcenter.y]]},
    {'pos': [[1, 1], [ini_mat.x + params.offcenter.x,  1], [ini_mat.x + params.offcenter.x, scaled_mat.y - params.offcenter.y]]},

    // bottom-right spillover rect
    {'pos': [[1, -1], [ini_mat.x + params.offcenter.x, -scaled_mat.y - params.offcenter.y], [1.0, -scaled_mat.y - params.offcenter.y]]},
    {'pos': [[1, -1], [ini_mat.x + params.offcenter.x,  -1], [ini_mat.x + params.offcenter.x, -scaled_mat.y - params.offcenter.y]]},

  ];

  spillover_triangles.label_corners = [

    // top-left spillover rect
    {'pos': [[-1, 1],
             [-ini_heat.x + inst_shift.x + params.offcenter.x, scaled_heat.y - inst_shift.y - params.offcenter.y],
             [-1.0, scaled_heat.y - inst_shift.y - params.offcenter.y]]
           },
    {'pos': [[-1, 1],
             [-ini_heat.x + inst_shift.x + params.offcenter.x,  1],
             [-ini_heat.x + inst_shift.x + params.offcenter.x, scaled_heat.y - inst_shift.y - params.offcenter.y]
             ]},

    // bottom-left spillover rect
    {'pos': [[-1, -1],
             [-ini_heat.x + inst_shift.x + params.offcenter.x, -scaled_mat.y - params.offcenter.y],
             [-1.0, -scaled_mat.y - params.offcenter.y]
             ]},
    {'pos': [[-1, -1],
             [-ini_heat.x + inst_shift.x + params.offcenter.x,  -1],
             [-ini_heat.x + inst_shift.x + params.offcenter.x, -scaled_mat.y - params.offcenter.y]
             ]},

    // top-right spillover rect (right angle triangle for slanted text only)
    {'pos': [
             // [1, scaled_mat.y + 1 - ini_mat.x - params.offcenter.y],
             [1, scaled_mat.y ],
             [ini_mat.x + params.offcenter.x, scaled_mat.y - params.offcenter.y],
             [1.0, scaled_mat.y - params.offcenter.y]
             ]},

    // area under slanted triangle
    {'pos': [[1.0, scaled_mat.y - params.offcenter.y],
             [ini_mat.x + params.offcenter.x, scaled_heat.y - inst_shift.y - params.offcenter.y],
             [1.0, scaled_heat.y - inst_shift.y - params.offcenter.y]
             ]},
    {'pos': [[ini_mat.x + params.offcenter.x, scaled_mat.y - params.offcenter.y],
             [1.0,  scaled_mat.y - params.offcenter.y],
             [ini_mat.x + params.offcenter.x, scaled_heat.y - inst_shift.y - params.offcenter.y]
             ]},

    // bottom-right spillover rect
    {'pos': [[1, -1],
             [ini_mat.x + params.offcenter.x, -scaled_mat.y - params.offcenter.y],
             [1.0, -scaled_mat.y - params.offcenter.y]
             ]},
    {'pos': [[1, -1],
             [ini_mat.x + params.offcenter.x,  -1],
             [ini_mat.x + params.offcenter.x, -scaled_mat.y - params.offcenter.y]
             ]},

  ];

  return spillover_triangles;

};