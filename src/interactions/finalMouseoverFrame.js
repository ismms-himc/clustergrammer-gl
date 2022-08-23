export default (function final_mouseover_frame(regl, params) {
  // reduce the number of mouseovers
  params.visualization.zoom_data.x.total_mouseover =
    params.visualization.zoom_data.x.total_mouseover - 1;
  if (
    params.visualization.zoom_data.x.total_mouseover === 0 &&
    params.interaction.still_mouseover === false
  ) {
    params.tooltip.show_tooltip = true;
  }
});
