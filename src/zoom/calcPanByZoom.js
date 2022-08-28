export default (function calc_pan_by_zoom(zoom_data, cursor_relative) {
  // pan_by_zoom relative to matrix max and min
  // zooming in causes negative panning
  // net positive panning is not allowed
  const inst_eff_zoom = zoom_data.inst_zoom - 1;
  return {
    ...zoom_data,
    inst_eff_zoom,
    pbz_relative_min: -inst_eff_zoom * cursor_relative.min,
    pbz_relative_max: -inst_eff_zoom * cursor_relative.max,
  };
});
