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
  spillover_triangles.mat = [
    // // left spillover rect
    // {'pos': [[-1, 1], [-ini_mat.x, -1], [-1.0, -1]]},
    // {'pos': [[-1, 1], [-ini_mat.x,  1], [-ini_mat.x, -1]]},

    // // right spillover rect
    // {'pos': [[1, 1], [ini_mat.x, -1], [1.0, -1]]},
    // {'pos': [[1, 1], [ini_mat.x,  1], [ini_mat.x, -1]]},

    // // top spillover rect
    // {'pos': [[-ini_mat.x, 1], [-ini_mat.x, scaled_mat.y], [ini_mat.x, 1]]},
    // {'pos': [[ ini_mat.x, 1], [ini_mat.x, scaled_mat.y], [-ini_mat.x, scaled_mat.y]]},

    // // // bottom spillover rect
    // {'pos': [[-ini_mat.x, -1], [-ini_mat.x, -scaled_mat.y], [ini_mat.x, -1]]},
    // {'pos': [[ ini_mat.x, -1], [ini_mat.x, -scaled_mat.y], [-ini_mat.x, -scaled_mat.y]]},
  ];

  // trying to shift based on diff between mat and heat size
  var inst_shift = params.mat_size.y - params.heat_size.y;

  spillover_triangles.mat_corners = [
    // // top-left spillover rect
    // {'pos': [[-1, 1], [-ini_mat.x, scaled_mat.y], [-1.0, scaled_mat.y]]},
    // {'pos': [[-1, 1], [-ini_mat.x,  1], [-ini_mat.x, scaled_mat.y]]},

    // top-left spillover rect
    // {'pos': [[-1, 1], [-ini_heat.x + inst_shift, scaled_heat.y - inst_shift], [-1.0 , scaled_heat.y - inst_shift]]},
    {'pos': [[-1, 1], [-ini_heat.x + 0 * inst_shift,  1], [-ini_heat.x, scaled_heat.y]]},

    // // bottom-left spillover rect
    // {'pos': [[-1, -1], [-ini_mat.x, -scaled_mat.y], [-1.0, -scaled_mat.y]]},
    // {'pos': [[-1, -1], [-ini_mat.x,  -1], [-ini_mat.x, -scaled_mat.y]]},

    // // top-right spillover rect
    // // mat corners
    // {'pos': [[1, 1], [ini_mat.x, scaled_mat.y], [1.0, scaled_mat.y]]},
    // {'pos': [[1, 1], [ini_mat.x,  1], [ini_mat.x, scaled_mat.y]]},

    // // bottom-right spillover rect
    // {'pos': [[1, -1], [ini_mat.x, -scaled_mat.y], [1.0, -scaled_mat.y]]},
    // {'pos': [[1, -1], [ini_mat.x,  -1], [ini_mat.x, -scaled_mat.y]]},

  ];

  spillover_triangles.label_corners = [
    // // top-left spillover rect
    // {'pos': [[-1, 1], [-ini_mat.x, scaled_mat.y], [-1.0, scaled_mat.y]]},
    // {'pos': [[-1, 1], [-ini_mat.x,  1], [-ini_mat.x, scaled_mat.y]]},

    // // bottom-left spillover rect
    // {'pos': [[-1, -1], [-ini_mat.x, -scaled_mat.y], [-1.0, -scaled_mat.y]]},
    // {'pos': [[-1, -1], [-ini_mat.x,  -1], [-ini_mat.x, -scaled_mat.y]]},

    // // top-right spillover rect
    // // label corners
    // {'pos': [[1, scaled_mat.y + (1-ini_mat.x)], [ini_mat.x, scaled_mat.y], [1.0, scaled_mat.y]]},

    // // bottom-right spillover rect
    // {'pos': [[1, -1], [ini_mat.x, -scaled_mat.y], [1.0, -scaled_mat.y]]},
    // {'pos': [[1, -1], [ini_mat.x,  -1], [ini_mat.x, -scaled_mat.y]]},

  ];

  return spillover_triangles;

};