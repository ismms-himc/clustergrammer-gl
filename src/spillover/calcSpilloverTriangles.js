export default (function calc_spillover_triangles(state) {
  const viz_dim = state.visualization.viz_dim;
  const ofc = viz_dim.offcenter;
  const ini_mat = viz_dim.mat_size;
  const ini_heat = viz_dim.heat_size;
  const height_to_width = viz_dim.canvas.height / viz_dim.canvas.width;
  const scaled_mat = {};
  scaled_mat.x = ini_mat.x / height_to_width;
  scaled_mat.y = ini_mat.y / height_to_width;
  const scaled_heat = {};
  scaled_heat.x = ini_heat.x / height_to_width;
  scaled_heat.y = ini_heat.y / height_to_width;
  const spillover_triangles = {};
  const dendro_trap = state.dendro.trap_height + state.dendro.trap_float;
  // trying to shift based on diff between mat and heat size
  const inst_shift = {};
  inst_shift.x = viz_dim.mat_size.x - viz_dim.heat_size.x;
  inst_shift.y = viz_dim.mat_size.y - viz_dim.heat_size.y;
  spillover_triangles.mat_sides = [
    // left spillover rect
    {
      pos: [
        [-1, 1],
        [-ini_mat.x + ofc.x, -1],
        [-1.0, -1],
      ],
    },
    {
      pos: [
        [-1, 1],
        [-ini_mat.x + ofc.x, 1],
        [-ini_mat.x + ofc.x, -1],
      ],
    },
    // right spillover rect
    {
      pos: [
        [1, 1],
        [ini_mat.x + ofc.x, -1],
        [1.0, -1],
      ],
    },
    {
      pos: [
        [1, 1],
        [ini_mat.x + ofc.x, 1],
        [ini_mat.x + ofc.x, -1],
      ],
    },
    // // top spillover rect
    {
      pos: [
        [-ini_mat.x + ofc.x, 1],
        [-ini_mat.x + ofc.x, scaled_mat.y - ofc.y],
        [ini_mat.x + ofc.x, 1],
      ],
    },
    {
      pos: [
        [ini_mat.x + ofc.x, 1],
        [ini_mat.x + ofc.x, scaled_mat.y - ofc.y],
        [-ini_mat.x + ofc.x, scaled_mat.y - ofc.y],
      ],
    },
    // // bottom spillover rect
    {
      pos: [
        [-ini_mat.x + ofc.x, -1],
        [-ini_mat.x + ofc.x, -scaled_mat.y - ofc.y],
        [ini_mat.x + ofc.x, -1],
      ],
    },
    {
      pos: [
        [ini_mat.x + ofc.x, -1],
        [ini_mat.x + ofc.x, -scaled_mat.y - ofc.y],
        [-ini_mat.x + ofc.x, -scaled_mat.y - ofc.y],
      ],
    },
  ];
  spillover_triangles.cats = [
    // col spillover rect
    {
      pos: [
        [ini_heat.x + inst_shift.x + ofc.x, scaled_mat.y - ofc.y],
        [
          -ini_heat.x + inst_shift.x + ofc.x,
          scaled_heat.y - inst_shift.y - ofc.y,
        ],
        [
          ini_heat.x + inst_shift.x + ofc.x,
          scaled_heat.y - inst_shift.y - ofc.y,
        ],
      ],
    },
    {
      pos: [
        [-ini_heat.x + inst_shift.x + ofc.x, scaled_mat.y - ofc.y],
        [ini_mat.x + ofc.x, scaled_mat.y - ofc.y],
        [
          -ini_heat.x + inst_shift.x + ofc.x,
          scaled_heat.y - inst_shift.y - ofc.y,
        ],
      ],
    },
    // col spillover rect
    {
      pos: [
        [-ini_mat.x + ofc.x, -scaled_mat.y - ofc.y],
        [-ini_mat.x + ofc.x, scaled_heat.y - inst_shift.y - ofc.y],
        [
          -ini_heat.x + inst_shift.x + ofc.x,
          scaled_heat.y - inst_shift.y - ofc.y,
        ],
      ],
    },
    {
      pos: [
        [-ini_mat.x + ofc.x, -scaled_mat.y - ofc.y],
        [-ini_heat.x + inst_shift.x + ofc.x, -scaled_mat.y - ofc.y],
        [
          -ini_heat.x + inst_shift.x + ofc.x,
          scaled_heat.y - inst_shift.y - ofc.y,
        ],
      ],
    },
  ];
  spillover_triangles.mat_corners = [
    // top-left spillover rect
    {
      pos: [
        [-1, 1],
        [
          -ini_heat.x + inst_shift.x + ofc.x,
          scaled_heat.y - inst_shift.y - ofc.y,
        ],
        [-1.0, scaled_heat.y - inst_shift.y - ofc.y],
      ],
    },
    {
      pos: [
        [-1, 1],
        [-ini_heat.x + inst_shift.x + ofc.x, 1],
        [
          -ini_heat.x + inst_shift.x + ofc.x,
          scaled_heat.y - inst_shift.y - ofc.y,
        ],
      ],
    },
    // bottom-left spillover rect
    {
      pos: [
        [-1, -1],
        [-ini_mat.x + ofc.x, -scaled_mat.y - ofc.y],
        [-1.0, -scaled_mat.y - ofc.y],
      ],
    },
    {
      pos: [
        [-1, -1],
        [-ini_mat.x + ofc.x, -1],
        [-ini_mat.x + ofc.x, -scaled_mat.y - ofc.y],
      ],
    },
    // top-right spillover rect
    // mat corners
    {
      pos: [
        [1, 1],
        [ini_mat.x + ofc.x, scaled_mat.y - ofc.y],
        [1.0, scaled_mat.y - ofc.y],
      ],
    },
    {
      pos: [
        [1, 1],
        [ini_mat.x + ofc.x, 1],
        [ini_mat.x + ofc.x, scaled_mat.y - ofc.y],
      ],
    },
    // bottom-right spillover rect
    {
      pos: [
        [1, -1],
        [ini_mat.x + ofc.x, -scaled_mat.y - ofc.y],
        [1, -scaled_mat.y - ofc.y],
      ],
    },
    {
      pos: [
        [1, -1],
        [ini_mat.x + ofc.x, -1],
        [ini_mat.x + ofc.x, -scaled_mat.y - ofc.y],
      ],
    },
  ];
  spillover_triangles.label_corners = [
    // top-left spillover rect
    {
      pos: [
        [-1, 1],
        [
          -ini_heat.x + inst_shift.x + ofc.x,
          scaled_heat.y - inst_shift.y - ofc.y,
        ],
        [-1.0, scaled_heat.y - inst_shift.y - ofc.y],
      ],
    },
    {
      pos: [
        [-1, 1],
        [-ini_heat.x + inst_shift.x + ofc.x, 1],
        [
          -ini_heat.x + inst_shift.x + ofc.x,
          scaled_heat.y - inst_shift.y - ofc.y,
        ],
      ],
    },
    // bottom-left spillover rect
    {
      pos: [
        [-1, -1],
        [-ini_heat.x + inst_shift.x + ofc.x, -scaled_mat.y - ofc.y],
        [-1.0, -scaled_mat.y - ofc.y],
      ],
    },
    {
      pos: [
        [-1, -1],
        [-ini_heat.x + inst_shift.x + ofc.x, -1],
        [-ini_heat.x + inst_shift.x + ofc.x, -scaled_mat.y - ofc.y],
      ],
    },
    // top-right spillover rect (right angle triangle for slanted text only)
    {
      pos: [
        // [1, scaled_mat.y + 1 - ini_mat.x - ofc.y],
        [1, scaled_mat.y + 1 - ini_mat.y - 2.0 * ofc.x],
        [ini_mat.x + ofc.x, scaled_mat.y - ofc.y],
        [1.0, scaled_mat.y - ofc.y],
      ],
    },
    // area under slanted triangle
    {
      pos: [
        [1.0, scaled_mat.y - ofc.y],
        [ini_mat.x + ofc.x, scaled_heat.y - inst_shift.y - ofc.y],
        [1.0, scaled_heat.y - inst_shift.y - ofc.y],
      ],
    },
    {
      pos: [
        [ini_mat.x + ofc.x, scaled_mat.y - ofc.y],
        [1.0, scaled_mat.y - ofc.y],
        [ini_mat.x + ofc.x, scaled_heat.y - inst_shift.y - ofc.y],
      ],
    },
    // bottom-right spillover rect
    {
      pos: [
        [1, -1],
        [ini_mat.x + ofc.x, -scaled_mat.y - ofc.y],
        [1.0, -scaled_mat.y - ofc.y],
      ],
    },
    {
      pos: [
        [1, -1],
        [ini_mat.x + ofc.x, -1],
        [ini_mat.x + ofc.x, -scaled_mat.y - ofc.y],
      ],
    },
    // row dendro trapezoids
    {
      pos: [
        [1, scaled_heat.y - inst_shift.y - ofc.y],
        [ini_mat.x + ofc.x + dendro_trap, -scaled_mat.y - ofc.y],
        [1.0, -scaled_mat.y - ofc.y],
      ],
    },
    {
      pos: [
        [1, scaled_heat.y - inst_shift.y - ofc.y],
        [ini_mat.x + ofc.x + dendro_trap, scaled_heat.y - inst_shift.y - ofc.y],
        [ini_mat.x + ofc.x + dendro_trap, -scaled_mat.y - ofc.y],
      ],
    },
    // col dendro trapezoids
    {
      pos: [
        [-ini_heat.x + inst_shift.x + ofc.x, -1],
        [
          -ini_heat.x + inst_shift.x + ofc.x,
          -scaled_mat.y - ofc.y - dendro_trap,
        ],
        [ini_mat.x + ofc.x, -1],
      ],
    },
    {
      pos: [
        [ini_mat.x + ofc.x, -1],
        [ini_mat.x + ofc.x, -scaled_mat.y - ofc.y - dendro_trap],
        [
          -ini_heat.x + inst_shift.x + ofc.x,
          -scaled_mat.y - ofc.y - dendro_trap,
        ],
      ],
    },
  ];
  return spillover_triangles;
});
