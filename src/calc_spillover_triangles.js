module.exports = function calc_spillover_triangles(params){

  var viz_dim = params.viz_dim;

  var mat_size = params.mat_size;

  var height_to_width = viz_dim.canvas.height/viz_dim.canvas.width;
  var scaled_height = mat_size / height_to_width;


  var spillover_triangles = {};
  spillover_triangles.mat = [
    // left spillover rect
    {'pos': [[-1, 1], [-mat_size, -1], [-1.0, -1]]},
    {'pos': [[-1, 1], [-mat_size,  1], [-mat_size, -1]]},

    // right spillover rect
    {'pos': [[1, 1], [mat_size, -1], [1.0, -1]]},
    {'pos': [[1, 1], [mat_size,  1], [mat_size, -1]]},

    // top spillover rect
    {'pos': [[-mat_size, 1], [-mat_size, scaled_height], [mat_size, 1]]},
    {'pos': [[ mat_size, 1], [mat_size, scaled_height], [-mat_size, scaled_height]]},

    // bottom spillover rect
    {'pos': [[-mat_size, -1], [-mat_size, -scaled_height], [mat_size, -1]]},
    {'pos': [[ mat_size, -1], [mat_size, -scaled_height], [-mat_size, -scaled_height]]},
  ];

  spillover_triangles.corners = [
    // top-left spillover rect
    {'pos': [[-1, 1], [-mat_size, scaled_height], [-1.0, scaled_height]]},
    {'pos': [[-1, 1], [-mat_size,  1], [-mat_size, scaled_height]]},

    // bottom-left spillover rect
    {'pos': [[-1, -1], [-mat_size, -scaled_height], [-1.0, -scaled_height]]},
    {'pos': [[-1, -1], [-mat_size,  -1], [-mat_size, -scaled_height]]},

    // top-right spillover rect
    {'pos': [[1, 1], [mat_size, scaled_height], [1.0, scaled_height]]},
    {'pos': [[1, 1], [mat_size,  1], [mat_size, scaled_height]]},

    // bottom-right spillover rect
    {'pos': [[1, -1], [mat_size, -scaled_height], [1.0, -scaled_height]]},
    {'pos': [[1, -1], [mat_size,  -1], [mat_size, -scaled_height]]},

  ];

  return spillover_triangles;

};