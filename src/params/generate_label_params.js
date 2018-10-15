var generate_ordered_labels = require('./../matrix_labels/generate_ordered_labels');
module.exports = function generate_label_params(params){

  params.labels = {};
  params.labels.num_row = params.mat_data.length;
  params.labels.num_col = params.mat_data[0].length;

  params.labels.offset_dict = {};
  params.labels.draw_labels = false;

  // font_detail range: min ~12 max ~200
  // usable range: 14-30 (was using 25)
  params.labels.font_detail = 40;

  generate_ordered_labels(params);

};