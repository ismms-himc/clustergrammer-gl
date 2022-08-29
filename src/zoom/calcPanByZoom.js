import { cloneDeep } from "lodash";

export default (function calc_pan_by_zoom(zoom_data, cursor_relative) {
  const newZoomData = cloneDeep(zoom_data);

  // pan_by_zoom relative to matrix max and min
  // zooming in causes negative panning
  // net positive panning is not allowed
  newZoomData.inst_eff_zoom = newZoomData.inst_zoom - 1;
  newZoomData.pbz_relative_min =
    -newZoomData.inst_eff_zoom * cursor_relative.min;
  newZoomData.pbz_relative_max =
    -newZoomData.inst_eff_zoom * cursor_relative.max;
  return newZoomData;
});
