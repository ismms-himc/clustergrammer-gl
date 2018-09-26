var make_tooltip_background_args = require('./../tooltip/make_tooltip_background_args');
module.exports = function generate_tooltip_params(regl, params){

  params.tooltip = {};
  params.tooltip.show_tooltip = false;
  params.tooltip.remove_tooltip_frame = true;
  params.tooltip.in_bounds_tooltip = false;
  params.tooltip.background_opacity = 0.75;
  params.tooltip.tooltip_args = make_tooltip_background_args(regl, params, 0.0001, [0, 0, 0, params.tooltip.background_opacity]);

}