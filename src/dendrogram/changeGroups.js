import * as d3 from "d3";
import { cloneDeep } from "lodash";
import { setDendrogramState } from "../state/reducers/dendrogramSlice";
import alt_slice_linkage from "./altSliceLinkage";
import calc_dendro_triangles from "./calcDendroTriangles";

export default (function change_groups(store, axis, slider_value) {
  const state = store.getState();
  const dispatch = store.dispatch;
  let newDendrogramState = cloneDeep(state.dendro);
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
      state.visualization.rootElementId +
        " ." +
        axis +
        "_dendro_slider_svg .dendro_level_text"
    ).text(rounded_slider_value);
  } else {
    newDendrogramState = {
      ...newDendrogramState,
      group_level: {
        ...newDendrogramState.group_level,
        [axis]: slider_value,
      },
    };
  }
  newDendrogramState = {
    ...newDendrogramState,
    group_info: {
      ...newDendrogramState.group_info,
      [axis]: calc_dendro_triangles(store, newDendrogramState, axis),
    },
  };
  dispatch(setDendrogramState(newDendrogramState));
});
