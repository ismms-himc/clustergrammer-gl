var make_full_name = require('./make_full_name');
var underscore = require('underscore');

module.exports = function make_matrix_string(params){

  var inst_matrix = params.matrix;

  let tuple_labels = false

  // get order indexes
  var order_indexes = {};
  var inst_name;
  var inst_rc;
  underscore.each(['row', 'col'], function(inst_rc){

    inst_name = params.order.inst[inst_rc]

    order_indexes[inst_rc] = params.network[inst_rc + '_nodes']
                                   .map(x => {
                                     let inst_num_labels = params.labels['num_' + inst_rc] - 1
                                     let new_index = inst_num_labels - x.ini
                                     return new_index
                                   })

  });

  // write first matrix row (e.g. column names)
  ////////////////////////////////////////////////
  // let delimiter = '\t'
  let delimiter = ','
  var matrix_string = delimiter
  var row_nodes = params.network.row_nodes;
  var col_nodes = params.network.col_nodes;

  // alternate column entry
  for (var c_i=0; c_i<order_indexes.col.length; c_i++){

    var inst_index = order_indexes.col[c_i];

    var inst_col = col_nodes[inst_index];

    let col_name
    if (tuple_labels){
       col_name = make_full_name(params, inst_col, 'col');
    } else {
      col_name = inst_col.name

      if (col_name.includes(': ')){
        col_name = col_name.split(': ')[1]
      }
    }

    if (c_i < order_indexes.col.length-1){
      matrix_string = matrix_string + col_name + delimiter;
    } else {
      matrix_string = matrix_string + col_name ;
    }

  }

  var row_data;
  matrix_string = matrix_string + '\n';

  // write matrix rows
  ////////////////////////
  underscore.each(order_indexes.row, function(inst_index){

    row_data = params.mat_data[inst_index]

    var inst_row = row_nodes[inst_index];

    let row_name;
    if (tuple_labels){
      row_name = make_full_name(params, inst_row, 'row');
    } else {
      row_name = inst_row.name

      if (row_name.includes(': ')){
        row_name = row_name.split(': ')[1]
      }
    }

    matrix_string = matrix_string + row_name + delimiter;

    for (var r_i=0; r_i<order_indexes.col.length; r_i++){

      // get the order
      var col_index = order_indexes.col[r_i];

      if (r_i < order_indexes.col.length-1){
        matrix_string = matrix_string + String(row_data[col_index]) + delimiter;
      } else {
        matrix_string = matrix_string + String(row_data[col_index]);
      }

    }

    matrix_string = matrix_string + '\n';

  });

  return matrix_string;

};