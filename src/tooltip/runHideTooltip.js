export default (function run_hide_tooltip(
  tooltip,
  tooltip_fun,
  click_on_heatmap = false
) {
  if (tooltip.permanent_tooltip === false) {
    tooltip_fun.hide();
  }
  if (click_on_heatmap) {
    tooltip.permanent_tooltip = false;
    tooltip_fun.hide();
  }
});
