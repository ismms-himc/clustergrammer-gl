module.exports = function calc_spillover_triangles(params){

  var viz_dim = params.viz_dim;

  var ini_mat = params.mat_size;

  var height_to_width = viz_dim.canvas.height/viz_dim.canvas.width;
  var scaled_mat = {};
  scaled_mat.x = ini_mat.x / height_to_width;
  scaled_mat.y = ini_mat.y / height_to_width;


  var spillover_triangles = {};
  spillover_triangles.mat = [
    // left spillover rect
    {'pos': [[-1, 1], [-ini_mat.x, -1], [-1.0, -1]]},
    {'pos': [[-1, 1], [-ini_mat.x,  1], [-ini_mat.x, -1]]},

    // right spillover rect
    {'pos': [[1, 1], [ini_mat.x, -1], [1.0, -1]]},
    {'pos': [[1, 1], [ini_mat.x,  1], [ini_mat.x, -1]]},

    // top spillover rect
    {'pos': [[-ini_mat.x, 1], [-ini_mat.x, scaled_mat.y], [ini_mat.x, 1]]},
    {'pos': [[ ini_mat.x, 1], [ini_mat.x, scaled_mat.y], [-ini_mat.x, scaled_mat.y]]},

    // // bottom spillover rect
    {'pos': [[-ini_mat.x, -1], [-ini_mat.x, -scaled_mat.y], [ini_mat.x, -1]]},
    {'pos': [[ ini_mat.x, -1], [ini_mat.x, -scaled_mat.y], [-ini_mat.x, -scaled_mat.y]]},
  ];

  spillover_triangles.mat_corners = [
    // top-left spillover rect
    {'pos': [[-1, 1], [-ini_mat.x, scaled_mat.y], [-1.0, scaled_mat.y]]},
    {'pos': [[-1, 1], [-ini_mat.x,  1], [-ini_mat.x, scaled_mat.y]]},

    // bottom-left spillover rect
    {'pos': [[-1, -1], [-ini_mat.x, -scaled_mat.y], [-1.0, -scaled_mat.y]]},
    {'pos': [[-1, -1], [-ini_mat.x,  -1], [-ini_mat.x, -scaled_mat.y]]},

    // top-right spillover rect
    // mat corners
    {'pos': [[1, 1], [ini_mat.x, scaled_mat.y], [1.0, scaled_mat.y]]},
    {'pos': [[1, 1], [ini_mat.x,  1], [ini_mat.x, scaled_mat.y]]},

    // bottom-right spillover rect
    {'pos': [[1, -1], [ini_mat.x, -scaled_mat.y], [1.0, -scaled_mat.y]]},
    {'pos': [[1, -1], [ini_mat.x,  -1], [ini_mat.x, -scaled_mat.y]]},

  ];

  spillover_triangles.label_corners = [
    // top-left spillover rect
    {'pos': [[-1, 1], [-ini_mat.x, scaled_mat.y], [-1.0, scaled_mat.y]]},
    {'pos': [[-1, 1], [-ini_mat.x,  1], [-ini_mat.x, scaled_mat.y]]},

    // bottom-left spillover rect
    {'pos': [[-1, -1], [-ini_mat.x, -scaled_mat.y], [-1.0, -scaled_mat.y]]},
    {'pos': [[-1, -1], [-ini_mat.x,  -1], [-ini_mat.x, -scaled_mat.y]]},

    // top-right spillover rect
    // label corners
    {'pos': [[1, scaled_mat.y + (1-ini_mat.x)], [ini_mat.x, scaled_mat.y], [1.0, scaled_mat.y]]},

    // bottom-right spillover rect
    {'pos': [[1, -1], [ini_mat.x, -scaled_mat.y], [1.0, -scaled_mat.y]]},
    {'pos': [[1, -1], [ini_mat.x,  -1], [ini_mat.x, -scaled_mat.y]]},

  ];

  return spillover_triangles;

};