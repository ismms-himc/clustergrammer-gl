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
    // textBaseline: 'middle',
    textBaseline: 'bottom',
    triangles: true,
    size: params.font_detail,
    font: '"Open Sans", verdana, arial, sans-serif'
  };

  // draw matrix cells
  /////////////////////////////////////////
  var x_arr = params.canvas_pos.x_arr;

  // generating array with text triangles and y-offsets
  var text_triangles = [];

  var inst_order = params.inst_order[inst_axis];

  var viz_area = params.viz_area;
  var kept_col_x = [];

  _.each(inst_nodes, function(inst_node, inst_id){

    var col_order_id = params.network.col_nodes[inst_id][inst_order];
    var inst_x = x_arr[ (num_labels - 1) - col_order_id ] + 0.5/num_labels;

    if (inst_x > viz_area.x_min && inst_x < viz_area.x_max){

      var inst_name = inst_node.name;

      if (inst_name.indexOf(': ') >= 0){
          inst_name = inst_node.name.split(': ')[1];
      }

      var tmp_text_vect;
      if (inst_name in params.text_triangles.col){
        tmp_text_vect = params.text_triangles.col[inst_name];
      } else {
        tmp_text_vect = vectorizeText(inst_name, vect_text_attrs);
        params.text_triangles.col[inst_name] = tmp_text_vect;
      }

      tmp_text_vect.offset = [0, inst_x];
      text_triangles.push(tmp_text_vect);

      var inst_data = {};
      inst_data.y = inst_x;
      inst_data.name = inst_name;
      kept_col_x.push(inst_data);
    }

  });


  params.kept_col_x = kept_col_x;

  return text_triangles;

};