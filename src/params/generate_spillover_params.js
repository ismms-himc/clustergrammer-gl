var make_spillover_args = require('./../spillover/make_spillover_args');

module.exports = function generate_spillover_params(regl, params){

  var spillover_args = {};

  // inst_depth is passed to spillover rects
  // var inst_color = [0, 0, 0, 0.02];
  var inst_color = [1, 1, 1, 1];

  params.spill_depth = {};
  params.spill_depth.mat_sides = 0.5;
  spillover_args.mat_sides = make_spillover_args(regl,
                                                 params.spill_depth.mat_sides,
                                                 inst_color);

  params.spill_depth.cats = 0.5;
  spillover_args.cats = make_spillover_args(regl,
                                                 params.spill_depth.cats,
                                                 inst_color);

  params.spill_depth.mat_corners = 0.2;
  spillover_args.mat_corners = make_spillover_args(regl,
                                                   params.spill_depth.mat_corners,
                                                   inst_color);
  params.spill_depth.label_corners = 0.001;
  spillover_args.label_corners = make_spillover_args(regl,
                                                     params.spill_depth.label_corners,
                                                     inst_color);

  params.spillover_args = spillover_args;

};