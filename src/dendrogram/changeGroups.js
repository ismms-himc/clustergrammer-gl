import * as d3 from "d3";
import { cloneDeep } from "lodash";
import { setDendrogramState } from "../state/reducers/dendrogramSlice";
import alt_slice_linkage from "./altSliceLinkage";
import calcDendroTriangles from "./calcDendroTriangles";
import makeDendroArgs from "./makeDendroArgs";

export default (function changeGroups(regl, store, axis, slider_value) {
  const { dendro, visualization } = store.getState();
  const dispatch = store.dispatch;
  const newDendrogramState = cloneDeep(dendro);
  newDendrogramState.update_dendro = true;
  if (newDendrogramState.precalc_linkage) {
    const dist_thresh =
      newDendrogramState.max_linkage_dist[axis] * slider_value;
    alt_slice_linkage(
      store,
      axis,
      dist_thresh,
      newDendrogramState.min_dist[axis]
    );
    const rounded_slider_value = Math.round(slider_value * 100) / 100;
    // update slider
    d3.select(
      visualization.rootElementId +
        " ." +
        axis +
        "_dendro_slider_svg .dendro_level_text"
    ).text(rounded_slider_value);
  } else {
    newDendrogramState.group_level[axis] = slider_value;
  }
  newDendrogramState.dendro.group_info[axis] = calcDendroTriangles(
    store,
    newDendrogramState,
    axis
  );
  newDendrogramState.dendro_args[axis] = makeDendroArgs(regl, store, axis);
  dispatch(setDendrogramState(newDendrogramState));
});
