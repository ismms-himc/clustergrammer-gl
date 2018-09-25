var vectorize_label = require('./vectorize_label')
// var calc_text_offsets = require('./calc_text_offsets');

module.exports = function calc_text_triangles(params, inst_axis){

  // console.log('calc_text_triangles')

  /*

  // Make dictionary of text trianglesß
  //////////////////////////////////////
  1. Save all calculated text triangles in a dictionary for re-use. We can
  construct the text triangle array when necessary by gathering the pre-
  calculated text triangles and calculating any new text triangles (as well as
  storing them back in the dictionary).

  2. Try calculating text triangles in the background, e.g. when not interacting,
  and save these to the text triangle dictionary.

  3. Try combining text triangles, for instance title and category.

  */

  // var inst_labels = params.network[inst_axis + '_nodes'];

  var inst_dim;
  if (inst_axis === 'col'){
    inst_dim = 'x';
  } else {
    inst_dim = 'y';
  }

  // draw matrix cells
  /////////////////////////////////////////

  // generating array with text triangles and y-offsets
  var text_triangles = [];
  var viz_area = params.viz_area;

  // only calculating the text-triangles for labels that are within the visible
  // area

  /*
  Need to pre-compute offsets in ini_parameters, then re-calc on reordering
  */
  // calc_text_offsets(params, inst_axis);

  var min_viz = viz_area[inst_dim + '_min'];
  var max_viz = viz_area[inst_dim + '_max'];

  _.each(params.network[inst_axis + '_nodes'], function(inst_label){


    if (inst_label.offsets.inst > min_viz && inst_label.offsets.inst < max_viz){

      // console.log('FOUND')

      ///////////////////////////////////
      // add to high queue
      ///////////////////////////////////

      var inst_name = inst_label.name;

      if (inst_name.indexOf(': ') >= 0){
        inst_name = inst_label.name.split(': ')[1];
      }

      // add to high priority queue
      params.label_high_queue[inst_axis].push(inst_name);

      ///////////////////////////////////
      // calc new text triangles
      ///////////////////////////////////

      var tmp_text_vect;
      if (inst_name in params.text_triangles[inst_axis]){
        tmp_text_vect = params.text_triangles[inst_axis][inst_name];

        tmp_text_vect.inst_offset = [0, inst_label.offsets.inst];
        tmp_text_vect.new_offset = [0, inst_label.offsets.new];
        text_triangles.push(tmp_text_vect);

      } else {

        /*
        working on delaying calculation of triangles until zooming has stopped
        */

        // console.log('working on delaying calculation of triangles until zooming has stopped')

        tmp_text_vect = vectorize_label(params, inst_axis, inst_name);
        params.text_triangles[inst_axis][inst_name] = tmp_text_vect;

        tmp_text_vect.inst_offset = [0, inst_label.offsets.inst];
        tmp_text_vect.new_offset = [0, inst_label.offsets.new];
        text_triangles.push(tmp_text_vect);

      }


    }

  });

  return text_triangles;

};