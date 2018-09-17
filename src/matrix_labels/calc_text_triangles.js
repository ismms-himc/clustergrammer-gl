const vectorizeText = require('vectorize-text');

module.exports = function calc_text_triangles(params, inst_axis){

  /*

  // Make dictionary of text triangles
  //////////////////////////////////////
  1. Save all calculated text triangles in a dictionary for re-use. We can
  construct the text triangle array when necessary by gathering the pre-
  calculated text triangles and calculating any new text triangles (as well as
  storing them back in the dictionary).

  2. Try calculating text triangles in the background, e.g. when not interacting,
  and save these to the text triangle dictionary.

  3. Try combining text triangles, for instance title and category.

  */

  var inst_order = params.inst_order[inst_axis];
  var new_order = params.new_order[inst_axis];

  var inst_labels = params.network[inst_axis + '_nodes'];
  var num_labels = params['num_' + inst_axis];

  var vect_text_attrs = {
    textAlign: 'left',
    // textBaseline: 'bottom',
    triangles: true,
    size: params.font_detail,
    font: '"Open Sans", verdana, arial, sans-serif'
  };

  var inst_dim;
  if (inst_axis === 'col'){
    inst_dim = 'x';
    vect_text_attrs.textAlign = 'left';
    vect_text_attrs.textBaseline = 'bottom';
  } else {
    inst_dim = 'y';
    vect_text_attrs.textAlign = 'right';
    vect_text_attrs.textBaseline = 'middle';
  }

  // draw matrix cells
  /////////////////////////////////////////
  var axis_arr = params.canvas_pos[inst_dim + '_arr'];

  // generating array with text triangles and y-offsets
  var text_triangles = [];


  var viz_area = params.viz_area;

  var order_id;
  var order_state;
  var offsets = {};

  // only calculating the text-triangles for labels that are within the visible
  // area
  _.each(inst_labels, function(inst_label, inst_id){

    // calculate inst and new offsets
    _.each(['inst', 'new'], function(inst_state){

      if (inst_state === 'inst'){
        order_state = inst_order
      } else {
         order_state = new_order
      }

      if (inst_axis === 'col'){
        order_id = params.network[inst_axis + '_nodes'][inst_id][order_state];
        offsets[inst_state] = axis_arr[ (num_labels - 1) - order_id ] + 0.5/num_labels;
      } else {
        order_id = num_labels - 1 - params.network[inst_axis + '_nodes'][inst_id][order_state];
        offsets[inst_state] = axis_arr[ order_id ] + 0.5/num_labels;
      }
    });

    if (offsets.inst > viz_area[inst_dim + '_min'] && offsets.inst < viz_area[inst_dim + '_max']){

      var inst_name = inst_label.name;

      if (inst_name.indexOf(': ') >= 0){
          inst_name = inst_label.name.split(': ')[1];
      }

      var tmp_text_vect;
      if (inst_name in params.text_triangles[inst_axis]){
        tmp_text_vect = params.text_triangles[inst_axis][inst_name];
      } else {
        console.log('vectorizeText')
        tmp_text_vect = vectorizeText(inst_name, vect_text_attrs);
        params.text_triangles[inst_axis][inst_name] = tmp_text_vect;
      }

      tmp_text_vect.inst_offset = [0, offsets.inst];
      tmp_text_vect.new_offset = [0, offsets.new];
      text_triangles.push(tmp_text_vect);

      var inst_data = {};
      inst_data.y = offsets.inst;
      inst_data.name = inst_name;
    }

  });

  return text_triangles;

};