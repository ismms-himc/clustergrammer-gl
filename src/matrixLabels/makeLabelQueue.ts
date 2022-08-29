import { Store } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import * as _ from "underscore";
import { mutateLabelsState } from "../state/reducers/labels/labelsSlice";
import { RootState } from "../state/store/store";

export default (function make_label_queue(store: Store<RootState>) {
  const { labels } = store.getState();

  const labelsQueue = cloneDeep(labels.labels_queue) || {};
  if (!("high" in labelsQueue)) {
    labelsQueue.high = { row: [], col: [] };
  }
  if (!("low" in labelsQueue)) {
    labelsQueue.low = { row: [], col: [] };
  }
  _.each(["row", "col"], function (inst_axis) {
    // the high priority queue is empty initially
    if (labelsQueue.high) {
      labelsQueue.high[inst_axis] = [];
    }
    // the low priority queue
    const inst_queue: string[] = [];
    const inst_labels: string[] = labels.ordered_labels[inst_axis + "s"];
    _.each(inst_labels, function (inst_label) {
      if (inst_label.indexOf(": ") >= 0) {
        inst_label = inst_label.split(": ")[1];
      }
      inst_queue.push(inst_label);
    });
    if (labelsQueue.low) {
      labelsQueue.low[inst_axis] = inst_queue;
    }
  });

  store.dispatch(
    mutateLabelsState({
      labels_queue: labelsQueue,
    })
  );
});
