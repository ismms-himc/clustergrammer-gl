import { selectAll } from "d3-selection";
import finalMouseoverFrame from "../../../interactions/finalMouseoverFrame";
import { setTotalMouseover } from "../../../state/reducers/visualization/visualizationSlice";

const WAIT_TIME_FINAL_MOUSEOVER = 100;

export default (function drawMouseover(store) {
  const state = store.getState();

  selectAll(state.visualization.rootElementId + " .group-svg-tooltip").remove();

  setTimeout(finalMouseoverFrame, WAIT_TIME_FINAL_MOUSEOVER, store);
  store.dispatch(setTotalMouseover(state.visualization.total_mouseover + 1));
});
