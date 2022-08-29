import { cloneDeep } from "lodash";
import { mutateVisualizationState } from "../state/reducers/visualization/visualizationSlice.js";

export default (function sanitize_inst_zoom(store, zoom_data) {
  // first sanitize zooming out if already completely zoomed out
  let sanitizedZoomData = cloneDeep(zoom_data);
  if (sanitizedZoomData.total_zoom === 1 && sanitizedZoomData.inst_zoom < 1) {
    sanitizedZoomData = {
      ...sanitizedZoomData,
      inst_zoom: 1,
    };
    // reset zoom
    store.dispatch(
      mutateVisualizationState({
        reset_cameras: true,
      })
    );
  }

  return sanitizedZoomData;
});
