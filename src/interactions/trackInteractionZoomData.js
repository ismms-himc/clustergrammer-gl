import { set } from "lodash";
import _ from "underscore";
import { setMouseoverInteraction } from "../state/reducers/interaction/interactionSlice";
import { mutateVisualizationState } from "../state/reducers/visualization/visualizationSlice";
import zoom_rules_low_mat from "../zoom/zoomRulesLowMat";
import findMouseoverElement from "./findMouseoverElement";
import keepTrackOfInteractions from "./keepTrackOfInteractions";
import keepTrackOfMouseovers from "./keepTrackOfMouseovers";

export default (function track_interaction_zoom_data(store, ev) {
  const state = store.getState();
  const dispatch = store.dispatch;

  const { zoom_data, zoom_restrict, viz_dim } = state.visualization;
  const newZoomData = _.clone(zoom_data);
  const interaction_types = ["wheel", "touch", "pinch"];
  let mouseover;
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
    set(newZoomData, "x", {
      ...newZoomData.x,
      inst_zoom: ev.dsx,
      pan_by_drag: ev.dx,
      cursor_position: ev.x0,
    });
    set(newZoomData, "y", {
      ...newZoomData.y,
      inst_zoom: ev.dsy,
      pan_by_drag: ev.dy,
      cursor_position: ev.y0,
    });
    let potential_zoom;
    /*
          Zoom Switch: adjust x/y zooming based on non-square matrices
        */
    // set up two-stage zooming
    if (newZoomData.y.total_zoom < zoom_restrict.y.ratio) {
      set(newZoomData, ["x", "inst_zoom"], 1);
      potential_zoom = newZoomData.y.total_zoom * newZoomData.y.inst_zoom;
      // check potential_zoom
      if (potential_zoom > zoom_restrict.y.ratio) {
        // bump x inst_zoom
        set(
          newZoomData,
          ["x", "inst_zoom"],
          potential_zoom / zoom_restrict.y.ratio
        );
      }
    } else if (newZoomData.x.total_zoom < zoom_restrict.x.ratio) {
      set(newZoomData, ["y", "inst_zoom"], 1);
      potential_zoom = newZoomData.x.total_zoom * newZoomData.x.inst_zoom;
      // check potential_zoom
      if (potential_zoom > zoom_restrict.x.ratio) {
        // bump x inst_zoom
        set(
          newZoomData,
          ["y", "inst_zoom"],
          potential_zoom / zoom_restrict.x.ratio
        );
      }
    }

    const { zoom_data: zoomDataX, reset_cameras: reset_camerasX } =
      zoom_rules_low_mat(
        viz_dim,
        zoom_restrict.x,
        newZoomData.x,
        viz_dim.heat.x,
        viz_dim.mat.x,
        "x"
      );
    const { zoom_data: zoomDataY, reset_cameras: reset_camerasY } =
      zoom_rules_low_mat(
        viz_dim,
        zoom_restrict.y,
        newZoomData.y,
        viz_dim.heat.y,
        viz_dim.mat.y,
        "y"
      );
    newZoomData.x = zoomDataX;
    newZoomData.y = zoomDataY;
    dispatch(
      mutateVisualizationState({
        newZoomData,
        reset_cameras: reset_camerasX | reset_camerasY, // logical or the booleans so if either is true it's true
      })
    );
    keepTrackOfInteractions(store);
  } else if (ev.type === "mousemove") {
    // trying to keep track of interactions for mouseovers
    keepTrackOfMouseovers(store);
    mouseover = findMouseoverElement(store, ev);
    dispatch(setMouseoverInteraction(mouseover));
  }

  return mouseover;
});
