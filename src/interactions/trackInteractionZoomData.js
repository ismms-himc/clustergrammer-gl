import _ from "underscore";
import { setMouseoverInteraction } from "../state/reducers/interaction/interactionSlice";
import { mutateVisualizationState } from "../state/reducers/visualization/visualizationSlice";
import zoom_rules_low_mat from "../zoom/zoomRulesLowMat";
import findMouseoverElement from "./findMouseoverElement";
import keepTrackOfInteractions from "./keepTrackOfInteractions";
import keepTrackOfMouseovers from "./keepTrackOfMouseovers";

export default (function track_interaction_zoom_data(state, dispatch, ev) {
  const { zoom_data, zoom_restrict, viz_dim } = state;
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
    newZoomData.x.inst_zoom = ev.dsx;
    newZoomData.x.pan_by_drag = ev.dx;
    newZoomData.x.cursor_position = ev.x0;
    newZoomData.y.inst_zoom = ev.dsy;
    newZoomData.y.pan_by_drag = ev.dy;
    newZoomData.y.cursor_position = ev.y0;
    let potential_zoom;
    /*
          Zoom Switch: adjust x/y zooming based on non-square matrices
        */
    // set up two-stage zooming
    if (newZoomData.y.total_zoom < zoom_restrict.y.ratio) {
      newZoomData.x.inst_zoom = 1;
      potential_zoom = newZoomData.y.total_zoom * newZoomData.y.inst_zoom;
      // check potential_zoom
      if (potential_zoom > zoom_restrict.y.ratio) {
        // bump x inst_zoom
        newZoomData.x.inst_zoom = potential_zoom / zoom_restrict.y.ratio;
      }
    } else if (newZoomData.x.total_zoom < zoom_restrict.x.ratio) {
      newZoomData.y.inst_zoom = 1;
      potential_zoom = newZoomData.x.total_zoom * newZoomData.x.inst_zoom;
      // check potential_zoom
      if (potential_zoom > zoom_restrict.x.ratio) {
        // bump x inst_zoom
        newZoomData.y.inst_zoom = potential_zoom / zoom_restrict.x.ratio;
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
    keepTrackOfInteractions(state, dispatch);
  } else if (ev.type === "mousemove") {
    // trying to keep track of interactions for mouseovers
    keepTrackOfMouseovers(state, dispatch);
    mouseover = findMouseoverElement(state, dispatch, ev);
    dispatch(setMouseoverInteraction(mouseover));
  }

  return mouseover;
});
