import * as _ from "underscore";

export default (function make_label_queue(labels) {
  const labelsQueue = {};
  labelsQueue.low = {};
  labelsQueue.high = {};
  _.each(["row", "col"], function (inst_axis) {
    // the high priority queue is empty initially
    labelsQueue.high[inst_axis] = [];
    // the low priority queue
    const inst_queue = [];
    const inst_labels = labels.ordered_labels[inst_axis + "s"];
    _.each(inst_labels, function (inst_label) {
      if (inst_label.indexOf(": ") >= 0) {
        inst_label = inst_label.split(": ")[1];
      }
      inst_queue.push(inst_label);
    });
    // TODO: no assignment

    labelsQueue.low[inst_axis] = inst_queue;
  });
  return labelsQueue;
});
