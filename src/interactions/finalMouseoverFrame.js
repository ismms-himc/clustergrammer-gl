export default (function finalMouseoverFrame(state) {
  // reduce the number of mouseovers
  state.visualization.zoom_data.x.total_mouseover =
    state.visualization.zoom_data.x.total_mouseover - 1;
  if (
    state.visualization.zoom_data.x.total_mouseover === 0 &&
    state.interaction.still_mouseover === false
  ) {
    state.tooltip.show_tooltip = true;
  }
});
