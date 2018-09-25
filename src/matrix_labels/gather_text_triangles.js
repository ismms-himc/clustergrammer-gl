var vectorize_label = require('./vectorize_label')

module.exports = function gather_text_triangles(params, inst_axis){

  var inst_dim;
  if (inst_axis === 'col'){
    inst_dim = 'x';
  } else {
    inst_dim = 'y';
  }

  // generating array with text triangles and y-offsets
  params.text_triangles.draw[inst_axis] = [];
  var viz_area = params.viz_area;

  var min_viz = viz_area[inst_dim + '_min'];
  var max_viz = viz_area[inst_dim + '_max'];

  _.each(params.network[inst_axis + '_nodes'], function(inst_label){

    if (inst_label.offsets.inst > min_viz && inst_label.offsets.inst < max_viz){

      var inst_name = inst_label.name;

      if (inst_name.indexOf(': ') >= 0){
        inst_name = inst_label.name.split(': ')[1];
      }

      var inst_text_vect;
      if (inst_name in params.text_triangles[inst_axis]){

        // add to text_triangles.draw if pre-calculated
        inst_text_vect = params.text_triangles[inst_axis][inst_name];
        inst_text_vect.inst_offset = [0, inst_label.offsets.inst];
        inst_text_vect.new_offset = [0, inst_label.offsets.new];
        params.text_triangles.draw[inst_axis].push(inst_text_vect);

      } else {

        // calculate text vector
        inst_text_vect = vectorize_label(params, inst_axis, inst_name);

        params.text_triangles[inst_axis][inst_name] = inst_text_vect;
        inst_text_vect.inst_offset = [0, inst_label.offsets.inst];
        inst_text_vect.new_offset = [0, inst_label.offsets.new];
        params.text_triangles.draw[inst_axis].push(inst_text_vect);

      }

    }

  });

};