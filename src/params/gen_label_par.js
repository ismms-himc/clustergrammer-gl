var generate_ordered_labels = require('./../matrix_labels/generate_ordered_labels');
module.exports = function gen_label_par(params){

  var labels = {};
  labels.num_row = params.mat_data.length;
  labels.num_col = params.mat_data[0].length;

  labels.offset_dict = {};
  labels.draw_labels = false;

  // font_detail range: min ~12 max ~200
  // usable range: 14-30 (was using 25)
  labels.font_detail = 40;

  // generate titles if necessary
  var inst_label;
  labels.titles = {};
  labels.precalc = {}
  _.each(['row', 'col'], function(inst_axis){

    // initialize with empty title
    labels.titles[inst_axis] = '';

    inst_label = params.network[inst_axis + '_nodes'][0].name;
    if (inst_label.indexOf(': ') > 0){
      labels.titles[inst_axis] = inst_label.split(': ')[0];
    }

    // pre-calc text triangles if low enough number of labels
    labels.precalc[inst_axis] = false;

  });

  params.labels = labels;
  generate_ordered_labels(params);

};