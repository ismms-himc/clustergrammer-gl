const vectorizeText = require('vectorize-text');

module.exports = function calc_col_text_triangles(params){

  var inst_nodes = params.network.col_nodes;
  var num_col = params.num_col;

  var vect_text_attrs = {
    textAlign: 'left',
    textBaseline: 'middle',
    triangles: true,
    size: params.font_detail,
    font: '"Open Sans", verdana, arial, sans-serif'
  };

  // draw matrix cells
  /////////////////////////////////////////

  var x_arr = params.canvas_pos.x_arr;

  // generating array with col text triangles and y-offsets
  var col_text_triangles = [];

  var inst_order = 'clust';

  var viz_area = params.viz_area;
  var kept_col_x = [];

  _.each(inst_nodes, function(inst_node, col_id){

    var col_order_id = params.network.col_nodes[col_id][inst_order];

    var inst_x = x_arr[ (num_col - 1) - col_order_id ] + 0.5/num_col;

    if (inst_x > viz_area.x_min && inst_x < viz_area.x_max){
      var inst_name = inst_node.name;

      if (inst_name.indexOf(': ') >= 0){
        if ('cat-0' in inst_node){
          inst_name = inst_node.name.split(': ')[1] + '; ' +
                      inst_node['cat-0'].split(': ')[1];
        } else {
          inst_name = inst_node.name.split(': ')[1];
        }
      }

      var tmp_text_vect = vectorizeText(inst_name, vect_text_attrs);

      tmp_text_vect.offset = [0, inst_x];
      col_text_triangles.push(tmp_text_vect);

      var inst_data = {};
      inst_data.y = inst_x;
      inst_data.name = inst_name;
      kept_col_x.push(inst_data);
    }

    // var inst_name = inst_node.name.split(': ')[1];
    // var tmp_text_vect = vectorizeText(inst_name, vect_text_attrs);
    // var col_order_id = params.network.col_nodes[col_id][inst_order];

    // var inst_x = x_arr[ col_order_id ];
    // tmp_text_vect.offset = [ 0, inst_x];

    // col_text_triangles.push(tmp_text_vect);

  });


  params.kept_col_x = kept_col_x;

  return col_text_triangles;

};