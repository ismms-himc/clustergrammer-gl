module.exports = function final_mouseover_frame(regl, params) {
  // reduce the number of mouseovers
  params.zoom_data.x.total_mouseover = params.zoom_data.x.total_mouseover - 1;

  if (
    params.zoom_data.x.total_mouseover == 0 &&
    params.int.still_mouseover == false
  ) {
    params.tooltip.show_tooltip = true;
  }
};
