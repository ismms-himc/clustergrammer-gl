import { Store } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { ZoomAxisData } from "../state/reducers/visualization/visualizationSlice";
import { RootState } from "../state/store/store";

export default (function sanitize_potential_zoom(
  store: Store<RootState>,
  zoom_data: ZoomAxisData,
  axis: "x" | "y"
) {
  const {
    visualization: { zoom_restrict },
  } = store.getState();
  const max_zoom = zoom_restrict[axis].max;
  const min_zoom = zoom_restrict[axis].min;

  const newZoomData = cloneDeep(zoom_data);

  // calc unsanitized ptz (potential-total-zoom)
  // checking this prevents the real total_zoom from going out of bounds
  const ptz = newZoomData.total_zoom * newZoomData.inst_zoom;
  // zooming within allowed range
  if (ptz < max_zoom && ptz > min_zoom) {
    newZoomData.total_zoom = ptz;
  }
  // Zoom above max
  else if (ptz >= max_zoom) {
    if (newZoomData.inst_zoom < 1) {
      newZoomData.total_zoom = newZoomData.total_zoom * newZoomData.inst_zoom;
    } else {
      // bump zoom down to max and set zoom to max
      newZoomData.inst_zoom = max_zoom / newZoomData.total_zoom;
      newZoomData.total_zoom = max_zoom;
    }
  }
  // Zoom below min
  else if (ptz <= min_zoom) {
    if (newZoomData.inst_zoom > 1) {
      newZoomData.total_zoom = newZoomData.total_zoom * newZoomData.inst_zoom;
    } else {
      // bump zoom up to min and set zoom to min
      newZoomData.inst_zoom = min_zoom / newZoomData.total_zoom;
      newZoomData.total_zoom = min_zoom;
    }
  }

  return newZoomData;
});
