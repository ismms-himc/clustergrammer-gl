import { cloneDeep } from "lodash";

export default (function sanitize_potential_zoom(store, zoom_data) {
  const {
    visualization: { zoom_restrict },
  } = store.getState();
  const max_zoom = zoom_restrict.max;
  const min_zoom = zoom_restrict.min;

  let newZoomData = cloneDeep(zoom_data);

  // calc unsanitized ptz (potential-total-zoom)
  // checking this prevents the real total_zoom from going out of bounds
  const ptz = newZoomData.total_zoom * newZoomData.inst_zoom;
  // zooming within allowed range
  if (ptz < max_zoom && ptz > min_zoom) {
    newZoomData = {
      ...newZoomData,
      total_zoom: ptz,
    };
  }
  // Zoom above max
  else if (ptz >= max_zoom) {
    if (zoom_data.inst_zoom < 1) {
      newZoomData = {
        ...newZoomData,
        total_zoom: zoom_data.total_zoom * zoom_data.inst_zoom,
      };
    } else {
      // bump zoom down to max and set zoom to max
      newZoomData = {
        ...newZoomData,
        inst_zoom: max_zoom / zoom_data.total_zoom,
        total_zoom: max_zoom,
      };
    }
  }
  // Zoom below min
  else if (ptz <= min_zoom) {
    if (zoom_data.inst_zoom > 1) {
      newZoomData = {
        ...newZoomData,
        total_zoom: zoom_data.total_zoom * zoom_data.inst_zoom,
      };
    } else {
      // bump zoom up to min and set zoom to min
      newZoomData = {
        ...newZoomData,
        inst_zoom: min_zoom / zoom_data.total_zoom,
        total_zoom: min_zoom,
      };
    }
  }

  return newZoomData;
});
