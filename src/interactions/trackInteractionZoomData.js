import { mutateZoomData } from "../state/reducers/visualization/visualizationSlice";
import zoom_rules_low_mat from "../zoom/zoomRulesLowMat";
import findMouseoverElement from "./findMouseoverElement";
import keepTrackOfInteractions from "./keepTrackOfInteractions";
import keepTrackOfMouseovers from "./keepTrackOfMouseovers";

export default (function track_interaction_zoom_data(store, ev) {
  const state = store.getState();
  const dispatch = store.dispatch;

  const { zoom_data, zoom_restrict } = state.visualization;
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
    const newZoomData = {
      x: {
        ...zoom_data.x,
        inst_zoom: ev.dsx,
        pan_by_drag: ev.dx,
        cursor_position: ev.x0,
      },
      y: {
        ...zoom_data.y,
        inst_zoom: ev.dsy,
        pan_by_drag: ev.dy,
        cursor_position: ev.y0,
      },
    };
    dispatch(mutateZoomData(newZoomData));
    let potential_zoom;
    /*
          Zoom Switch: adjust x/y zooming based on non-square matrices
        */
    // set up two-stage zooming
    if (newZoomData.y.total_zoom < zoom_restrict.y.ratio) {
      let newXInstZoom = 1;
      potential_zoom = newZoomData.y.total_zoom * newZoomData.y.inst_zoom;
      // check potential_zoom
      if (potential_zoom > zoom_restrict.y.ratio) {
        // bump x inst_zoom
        newXInstZoom = potential_zoom / zoom_restrict.y.ratio;
      }
      dispatch(
        mutateZoomData({
          x: {
            inst_zoom: newXInstZoom,
          },
        })
      );
    } else if (newZoomData.x.total_zoom < zoom_restrict.x.ratio) {
      let newYInstZoom = 1;
      potential_zoom = newZoomData.x.total_zoom * newZoomData.x.inst_zoom;
      // check potential_zoom
      if (potential_zoom > zoom_restrict.x.ratio) {
        // bump y inst_zoom
        newYInstZoom = potential_zoom / zoom_restrict.x.ratio;
      }
      dispatch(
        mutateZoomData({
          y: {
            inst_zoom: newYInstZoom,
          },
        })
      );
    }
    zoom_rules_low_mat(store, "x");
    zoom_rules_low_mat(store, "y");
    keepTrackOfInteractions(store);
  } else if (ev.type === "mousemove") {
    // trying to keep track of interactions for mouseovers
    keepTrackOfMouseovers(store);
    findMouseoverElement(store, ev);
  }
});
