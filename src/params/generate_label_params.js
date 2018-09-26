var generate_ordered_labels = require('./../matrix_labels/generate_ordered_labels');
module.exports = function generate_label_params(params){

  params.labels = {};
  params.labels.offset_dict = {};
  params.labels.draw_labels = false;

  generate_ordered_labels(params);

};