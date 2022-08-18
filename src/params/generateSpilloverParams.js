var make_spillover_args = require("./../spillover/make_spillover_args");
var calc_spillover_triangles = require("./../spillover/calc_spillover_triangles");

module.exports = function generate_spillover_params(regl, params) {
  var spillover_args = {};

  // inst_depth is passed to spillover rects
  // var inst_color = [1, 0, 0, 1];
  var inst_color = [1, 1, 1, 1];

  // lower depth can be thought of as closer to the screen/user, e.g. on top
  // of other elements
  params.spill_depth = {};
  params.spill_depth.mat_sides = 0.5;
  params.spill_depth.cats = 0.5;
  params.spill_depth.mat_corners = 0.2;
  params.spill_depth.label_corners = 0.001;

  var spillover_elements = [
    "mat_sides",
    "cats",
    "mat_corners",
    "label_corners",
  ];

  _.each(spillover_elements, function (inst_element) {
    spillover_args[inst_element] = make_spillover_args(
      regl,
      params.spill_depth[inst_element],
      inst_color
    );
  });

  params.spillover_args = spillover_args;
  params.spillover_triangles = calc_spillover_triangles(params);
};
