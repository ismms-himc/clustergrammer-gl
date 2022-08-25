import * as d3 from "d3";
import finalMouseoverFrame from "../../interactions/finalMouseoverFrame";
import { mutateZoomData } from "../../state/reducers/visualization/visualizationSlice";

const WAIT_TIME_FINAL_MOUSEOVER = 100;

export default (function drawMouseover(store) {
  const state = store.getState();

  d3.selectAll(
    state.visualization.rootElementId + " .group-svg-tooltip"
  ).remove();
  store.dispatch(
    mutateZoomData({
      x: {
        total_mouseover: state.visualization.zoom_data.x.total_mouseover + 1,
      },
    })
  );

  setTimeout(finalMouseoverFrame, WAIT_TIME_FINAL_MOUSEOVER, state);
});
