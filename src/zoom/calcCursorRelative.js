export default (function calc_cursor_relative(zd, viz_dim_heat) {
  var cursor_relative = {};
  // tracking cursor position relative to the minimum
  cursor_relative.min =
    zd.cursor_position - viz_dim_heat.min - zd.viz_offcenter;
  /* Cursor restriction does not seem to be doing anything */
  // restrict cursor_relative.min
  if (cursor_relative.min < 0) {
    cursor_relative.min = 0;
  } else if (cursor_relative.min > viz_dim_heat.max) {
    cursor_relative.min = viz_dim_heat.max;
  }
  // tracking cursor position relative to the maximum
  /* trying to fix zoom in outside of matrix and zoom out inside of matrix bugn */
  cursor_relative.max =
    viz_dim_heat.max + zd.heat_offset - zd.cursor_position + zd.viz_offcenter;
  // restrict cursor_relative.max
  if (cursor_relative.max < 0) {
    cursor_relative.max = 0;
  } else if (cursor_relative.max > viz_dim_heat.max + zd.heat_offset) {
    cursor_relative.max = viz_dim_heat.max + zd.heat_offset;
  }
  return cursor_relative;
});
