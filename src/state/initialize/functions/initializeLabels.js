import { cloneDeep } from "lodash";
import * as _ from "underscore";
import genOrderedLabels from "../../../matrixLabels/genOrderedLabels";
import { mutateLabelsState } from "../../reducers/labels/labelsSlice";

export default function initializeLabels(store) {
  const state = store.getState();

  const labels = cloneDeep(state.labels);
  labels.num_row = state.network.mat.length;
  labels.num_col = state.network.mat[0].length;
  // generate titles if necessary
  let inst_label;
  _.each(["row", "col"], function (inst_axis) {
    // initialize with empty title
    labels.titles[inst_axis] = "";
    inst_label = state.network[inst_axis + "_nodes"][0].name;
    if (inst_label.indexOf(": ") > 0) {
      labels.titles[inst_axis] = inst_label.split(": ")[0];
    }
    // pre-calc text triangles if low enough number of labels
    labels.precalc[inst_axis] = false;
  });
  store.dispatch(mutateLabelsState(labels));
  genOrderedLabels(store);
}
