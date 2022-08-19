export default (function calc_potential_total_pan(zoom_data) {
  // calculate unsanitized versions of the ptp (potential-total-pan)
  const ptp = {};
  ptp.min =
    zoom_data.total_pan_min +
    zoom_data.pan_by_drag / zoom_data.total_zoom +
    zoom_data.pbz_relative_min / zoom_data.total_zoom;
  // panning by drag has the opposite effect relative to the max/right side
  ptp.max =
    zoom_data.total_pan_max +
    -zoom_data.pan_by_drag / zoom_data.total_zoom +
    zoom_data.pbz_relative_max / zoom_data.total_zoom;
  return ptp;
});
