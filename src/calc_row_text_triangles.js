const vectorizeText = require('vectorize-text');

module.exports = function calc_row_text_triangles(params){

  var inst_nodes = params.network.row_nodes;
  var num_row = params.num_row;

  var row_height = 1/num_row;
  var y_offset_array = [];
  for (var i = 0; i < num_row; i++){
    y_offset_array[i] = 0.5 - row_height/2 - i * row_height;
  }

  var vect_text_attrs = {
    textAlign: 'right',
    textBaseline: 'middle',
    triangles:true,
    size:params.font_detail,
    font:'"Open Sans", verdana, arial, sans-serif'
  };

  // draw matrix cells
  /////////////////////////////////////////
  var y_arr = params.canvas_pos.y_arr;

  // generating array with row text triangles and y-offsets
  var row_text_triangles = [];

  var inst_order = 'clust';

  var viz_area = params.viz_area;
  var kept_row_y = [];

  _.each(inst_nodes, function(inst_node, row_id){

    var row_order_id = num_row - 1 - params.network.row_nodes[row_id][inst_order];
    var inst_y = y_arr[ row_order_id ] + 0.5/num_row;

    if (inst_y > viz_area.y_min && inst_y < viz_area.y_max){

      var inst_name = inst_node.name;

      if (inst_name.indexOf(': ') >= 0){
        inst_name = inst_node.name.split(': ')[1];
      }

      var tmp_text_vect = vectorizeText(inst_name, vect_text_attrs);
      tmp_text_vect.offset = [0, inst_y];
      row_text_triangles.push(tmp_text_vect);
      var inst_data = {};
      inst_data.y = inst_y;
      inst_data.name = inst_name;
      kept_row_y.push(inst_data);
    }

  });

  // using to improve row filtering behavior
  params.kept_row_y = kept_row_y;

  return row_text_triangles;

};