module.exports = function make_inst_queue(params){

  params.labels.queue = {}
  params.labels.queue.low = {}
  params.labels.queue.high = {}

  var inst_queue;

  _.each(['row', 'col'], function(inst_axis){

    // the high priority queue is empty initially
    params.labels.queue.high[inst_axis] = [];

    // the low priority queue
    inst_queue = [];

    var inst_labels = params.ordered_labels[inst_axis + 's'];

    _.each(inst_labels, function(inst_label){

      if (inst_label.indexOf(': ') >= 0){
          inst_label = inst_label.split(': ')[1];
      }

      inst_queue.push(inst_label);

    });

    params.labels.queue.low[inst_axis] = inst_queue;

  });

};