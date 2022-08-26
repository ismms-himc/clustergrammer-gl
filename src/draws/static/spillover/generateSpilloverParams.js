import * as _ from "underscore";
import calc_spillover_triangles from "./calcSpilloverTriangles";
import make_spillover_args from "./makeSpilloverArgs";

export default (function generate_spillover_params(regl, state) {
  const spillover_args = {};
  // inst_depth is passed to spillover rects
  // var inst_color = [1, 0, 0, 1];
  const inst_color = [1, 1, 1, 1];
  // lower depth can be thought of as closer to the screen/user, e.g. on top
  // of other elements
  const spill_depth = {};
  spill_depth.mat_sides = 0.5;
  spill_depth.cats = 0.5;
  spill_depth.mat_corners = 0.2;
  spill_depth.label_corners = 0.001;
  const spillover_elements = [
    "mat_sides",
    "cats",
    "mat_corners",
    "label_corners",
  ];
  _.each(spillover_elements, function (inst_element) {
    spillover_args[inst_element] = make_spillover_args(
      regl,
      spill_depth[inst_element],
      inst_color
    );
  });
  const spillover_triangles = calc_spillover_triangles(state);
  return { spillover_triangles, spillover_args };
});
