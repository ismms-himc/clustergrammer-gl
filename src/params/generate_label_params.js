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

  // generate titles if necessary
  var inst_label;
  params.labels.titles = {};
  _.each(['row', 'col'], function(inst_axis){

    // initialize with empty title
    params.labels.titles[inst_axis] = '';

    inst_label = params.network[inst_axis + '_nodes'][0].name;
    if (inst_label.indexOf(': ') > 0){
      params.labels.titles[inst_axis] = inst_label.split(': ')[0];
    }
  })

};