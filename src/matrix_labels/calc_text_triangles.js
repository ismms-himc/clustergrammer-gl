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

  var inst_nodes = params.network[inst_axis + '_nodes'];
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

  var inst_order = params.inst_order[inst_axis];

  var viz_area = params.viz_area;

  _.each(inst_nodes, function(inst_node, inst_id){


    var order_id = params.network[inst_axis + '_nodes'][inst_id][inst_order];
    var inst_offset;
    if (inst_axis === 'col'){
      inst_offset = axis_arr[ (num_labels - 1) - order_id ] + 0.5/num_labels;
    } else {
      inst_offset = axis_arr[ order_id ] + 0.5/num_labels;
    }

    if (inst_offset > viz_area[inst_dim + '_min'] && inst_offset < viz_area[inst_dim + '_max']){

      var inst_name = inst_node.name;

      if (inst_name.indexOf(': ') >= 0){
          inst_name = inst_node.name.split(': ')[1];
      }

      var tmp_text_vect;
      if (inst_name in params.text_triangles[inst_axis]){
        tmp_text_vect = params.text_triangles[inst_axis][inst_name];
      } else {
        tmp_text_vect = vectorizeText(inst_name, vect_text_attrs);
        params.text_triangles[inst_axis][inst_name] = tmp_text_vect;
      }

      tmp_text_vect.offset = [0, inst_offset];
      text_triangles.push(tmp_text_vect);

      var inst_data = {};
      inst_data.y = inst_offset;
      inst_data.name = inst_name;
    }

  });

  return text_triangles;

};