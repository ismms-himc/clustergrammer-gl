module.exports = function calc_spillover_triangles(params){

  var viz_dim = params.viz_dim;

  var mat_size = params.mat_size;

  var height_to_width = viz_dim.canvas.height/viz_dim.canvas.width;
  var scaled_height = {};
  scaled_height.x = mat_size.x / height_to_width;
  scaled_height.y = mat_size.y / height_to_width;


  var spillover_triangles = {};
  spillover_triangles.mat = [
    // // left spillover rect
    // {'pos': [[-1, 1], [-mat_size.x, -1], [-1.0, -1]]},
    // {'pos': [[-1, 1], [-mat_size.x,  1], [-mat_size.x, -1]]},

    // // right spillover rect
    // {'pos': [[1, 1], [mat_size.x, -1], [1.0, -1]]},
    // {'pos': [[1, 1], [mat_size.x,  1], [mat_size.x, -1]]},

    // top spillover rect
    {'pos': [[-mat_size.x, 1], [-mat_size.x, scaled_height.y], [mat_size.x, 1]]},
    {'pos': [[ mat_size.x, 1], [mat_size.x, scaled_height.y], [-mat_size.x, scaled_height.y]]},

    // // bottom spillover rect
    // {'pos': [[-mat_size.x, -1], [-mat_size.x, -scaled_height.x], [mat_size.x, -1]]},
    // {'pos': [[ mat_size.x, -1], [mat_size.x, -scaled_height.x], [-mat_size.x, -scaled_height.x]]},
  ];

  spillover_triangles.corners = [
    // // top-left spillover rect
    // {'pos': [[-1, 1], [-mat_size.x, scaled_height.x], [-1.0, scaled_height.x]]},
    // {'pos': [[-1, 1], [-mat_size.x,  1], [-mat_size.x, scaled_height.x]]},

    // // bottom-left spillover rect
    // {'pos': [[-1, -1], [-mat_size.x, -scaled_height.x], [-1.0, -scaled_height.x]]},
    // {'pos': [[-1, -1], [-mat_size.x,  -1], [-mat_size.x, -scaled_height.x]]},

    // // top-right spillover rect
    // {'pos': [[1, 1], [mat_size.x, scaled_height.x], [1.0, scaled_height.x]]},
    // {'pos': [[1, 1], [mat_size.x,  1], [mat_size.x, scaled_height.x]]},

    // // bottom-right spillover rect
    // {'pos': [[1, -1], [mat_size.x, -scaled_height.x], [1.0, -scaled_height.x]]},
    // {'pos': [[1, -1], [mat_size.x,  -1], [mat_size.x, -scaled_height.x]]},

  ];

  return spillover_triangles;

};