import * as d3 from "d3";
import finalMouseoverFrame from "../../../interactions/finalMouseoverFrame";
import { setTotalMouseover } from "../../../state/reducers/visualization/visualizationSlice";

const WAIT_TIME_FINAL_MOUSEOVER = 100;

export default (function drawMouseover(store) {
  const state = store.getState();

  d3.selectAll(
    state.visualization.rootElementId + " .group-svg-tooltip"
  ).remove();
  store.dispatch(setTotalMouseover(state.visualization.total_mouseover + 1));

  setTimeout(finalMouseoverFrame, WAIT_TIME_FINAL_MOUSEOVER, store);
});
