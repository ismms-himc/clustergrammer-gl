module.exports = function calc_spillover_triangles(params){

  var viz_dim = params.viz_dim;

  var mat_size = params.mat_size;

  var height_to_width = viz_dim.canvas.height/viz_dim.canvas.width;
  var scaled_height = {};
  scaled_height.x = mat_size.x / height_to_width;
  scaled_height.y = mat_size.y / height_to_width;


  var spillover_triangles = {};
  spillover_triangles.mat = [
    // left spillover rect
    {'pos': [[-1, 1], [-mat_size.x, -1], [-1.0, -1]]},
    {'pos': [[-1, 1], [-mat_size.x,  1], [-mat_size.x, -1]]},

    // right spillover rect
    {'pos': [[1, 1], [mat_size.x, -1], [1.0, -1]]},
    {'pos': [[1, 1], [mat_size.x,  1], [mat_size.x, -1]]},

    // top spillover rect
    {'pos': [[-mat_size.x, 1], [-mat_size.x, scaled_height.y], [mat_size.x, 1]]},
    {'pos': [[ mat_size.x, 1], [mat_size.x, scaled_height.y], [-mat_size.x, scaled_height.y]]},

    // // bottom spillover rect
    {'pos': [[-mat_size.x, -1], [-mat_size.x, -scaled_height.y], [mat_size.x, -1]]},
    {'pos': [[ mat_size.x, -1], [mat_size.x, -scaled_height.y], [-mat_size.x, -scaled_height.y]]},
  ];

  spillover_triangles.mat_corners = [
    // top-left spillover rect
    {'pos': [[-1, 1], [-mat_size.x, scaled_height.y], [-1.0, scaled_height.y]]},
    {'pos': [[-1, 1], [-mat_size.x,  1], [-mat_size.x, scaled_height.y]]},

    // bottom-left spillover rect
    {'pos': [[-1, -1], [-mat_size.x, -scaled_height.y], [-1.0, -scaled_height.y]]},
    {'pos': [[-1, -1], [-mat_size.x,  -1], [-mat_size.x, -scaled_height.y]]},

    // top-right spillover rect
    // mat corners
    {'pos': [[1, 1], [mat_size.x, scaled_height.y], [1.0, scaled_height.y]]},
    {'pos': [[1, 1], [mat_size.x,  1], [mat_size.x, scaled_height.y]]},

    // bottom-right spillover rect
    {'pos': [[1, -1], [mat_size.x, -scaled_height.y], [1.0, -scaled_height.y]]},
    {'pos': [[1, -1], [mat_size.x,  -1], [mat_size.x, -scaled_height.y]]},

  ];

  spillover_triangles.label_corners = [
    // top-left spillover rect
    {'pos': [[-1, 1], [-mat_size.x, scaled_height.y], [-1.0, scaled_height.y]]},
    {'pos': [[-1, 1], [-mat_size.x,  1], [-mat_size.x, scaled_height.y]]},

    // bottom-left spillover rect
    {'pos': [[-1, -1], [-mat_size.x, -scaled_height.y], [-1.0, -scaled_height.y]]},
    {'pos': [[-1, -1], [-mat_size.x,  -1], [-mat_size.x, -scaled_height.y]]},

    // top-right spillover rect
    // label corners
    {'pos': [[1, scaled_height.y + (1-mat_size.x)], [mat_size.x, scaled_height.y], [1.0, scaled_height.y]]},

    // bottom-right spillover rect
    {'pos': [[1, -1], [mat_size.x, -scaled_height.y], [1.0, -scaled_height.y]]},
    {'pos': [[1, -1], [mat_size.x,  -1], [mat_size.x, -scaled_height.y]]},

  ];

  return spillover_triangles;

};