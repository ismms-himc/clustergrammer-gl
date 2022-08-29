import { Store } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { setZoomData } from "../state/reducers/visualization/visualizationSlice";
import { RootState } from "../state/store/store";
import { InteractionEvent } from "../types/general";
import zoom_rules_low_mat from "../zoom/zoomRulesLowMat";
import findMouseoverElement from "./findMouseoverElement";
import keepTrackOfInteractions from "./keepTrackOfInteractions";
import keepTrackOfMouseovers from "./keepTrackOfMouseovers";

export default (function track_interaction_zoom_data(
  store: Store<RootState>,
  ev: InteractionEvent
) {
  const state = store.getState();
  const dispatch = store.dispatch;

  const { zoom_data: oldZoomData, zoom_restrict } = state.visualization;
  const zoom_data = cloneDeep(oldZoomData);
  const interaction_types = ["wheel", "touch", "pinch"];
  if (ev.buttons || interaction_types.indexOf(ev.type) !== -1) {
    switch (ev.type) {
      case "wheel":
        ev.dsx = ev.dsy = Math.exp(-ev.dy / 100);
        ev.dx = ev.dy = 0;
        break;
      default:
        break;
    }
    // transfer data from ev to newZoomData
    zoom_data.x.inst_zoom = ev.dsx;
    zoom_data.x.pan_by_drag = ev.dx;
    zoom_data.x.cursor_position = ev.x0;

    zoom_data.y.inst_zoom = ev.dsy;
    zoom_data.y.pan_by_drag = ev.dy;
    zoom_data.y.cursor_position = ev.y0;
    let potential_zoom;
    /*
      Zoom Switch: adjust x/y zooming based on non-square matrices
    */
    // set up two-stage zooming
    if (zoom_data.y.total_zoom < zoom_restrict.y.ratio) {
      let newXInstZoom = 1;
      potential_zoom = zoom_data.y.total_zoom * zoom_data.y.inst_zoom;
      // check potential_zoom
      if (potential_zoom > zoom_restrict.y.ratio) {
        // bump x inst_zoom
        newXInstZoom = potential_zoom / zoom_restrict.y.ratio;
      }
      zoom_data.x.inst_zoom = newXInstZoom;
    } else if (zoom_data.x.total_zoom < zoom_restrict.x.ratio) {
      let newYInstZoom = 1;
      potential_zoom = zoom_data.x.total_zoom * zoom_data.x.inst_zoom;
      // check potential_zoom
      if (potential_zoom > zoom_restrict.x.ratio) {
        // bump y inst_zoom
        newYInstZoom = potential_zoom / zoom_restrict.x.ratio;
      }
      zoom_data.y.inst_zoom = newYInstZoom;
    }
    dispatch(setZoomData(zoom_data));
    zoom_rules_low_mat(store, "x");
    zoom_rules_low_mat(store, "y");
    keepTrackOfInteractions(store);
  } else if (ev.type === "mousemove") {
    // trying to keep track of interactions for mouseovers
    keepTrackOfMouseovers(store);
    findMouseoverElement(store, ev);
  }
});
