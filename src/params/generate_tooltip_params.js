module.exports = function generate_tooltip_params(regl, params){

  params.tooltip = {};
  params.tooltip.show_tooltip = false;
  params.tooltip.in_bounds_tooltip = false;
  params.tooltip.background_opacity = 0.75;
  params.tooltip.tooltip_type = null;

  params.tooltip.border_width = 10;
  // setting to true
  params.tooltip.on_canvas = true;
}