import { Store } from "@reduxjs/toolkit";
import { clone, set } from "lodash";
import * as _ from "underscore";
import { mutateLabelsState } from "../state/reducers/labels/labelsSlice";
import { RootState } from "../state/store/store";

export default (function make_label_queue(store: Store<RootState>) {
  const { labels } = store.getState();

  const labelsQueue = clone(labels.labels_queue) || {};
  if (!("high" in labelsQueue)) {
    set(labelsQueue, "high", {});
  }
  if (!("low" in labelsQueue)) {
    set(labelsQueue, "high", {});
  }
  _.each(["row", "col"], function (inst_axis) {
    // the high priority queue is empty initially
    set(labelsQueue, ["high", inst_axis], []);
    // the low priority queue
    const inst_queue: string[] = [];
    const inst_labels: string[] = labels.ordered_labels[inst_axis + "s"];
    _.each(inst_labels, function (inst_label) {
      if (inst_label.indexOf(": ") >= 0) {
        inst_label = inst_label.split(": ")[1];
      }
      inst_queue.push(inst_label);
    });
    set(labelsQueue, ["low", inst_axis], inst_queue);
  });

  store.dispatch(
    mutateLabelsState({
      labels_queue: labelsQueue,
    })
  );
});
