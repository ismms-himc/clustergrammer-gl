export default (function generate_tooltip_params(regl, params) {
  const tooltip = {};
  tooltip.show_tooltip = false;
  tooltip.in_bounds_tooltip = false;
  tooltip.background_opacity = 0.75;
  tooltip.tooltip_type = null;
  tooltip.border_width = 10;
  // setting to true
  tooltip.on_canvas = true;
  // enable user to mouseover and interact with the tooltip
  tooltip.permanent_tooltip = false;
  params.tooltip = tooltip;
});
