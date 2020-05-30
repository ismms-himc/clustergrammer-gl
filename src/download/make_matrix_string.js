var make_full_name = require('./make_full_name');
var underscore = require('underscore');

module.exports = function make_matrix_string(params){

  var inst_matrix = params.matrix;

  // get order indexes
  var order_indexes = {};
  var inst_name;
  var inst_rc;
  underscore.each(['row', 'col'], function(inst_rc){


    // // row/col names are reversed in saved orders
    // if (tmp_rc === 'row'){
    //   inst_rc = 'col';
    // } else {
    //   inst_rc = 'row';
    // }

    // row/col names are not reversed in clustergrammer-gl
    // inst_rc = tmp_rc

    // use tmp_rc
    // inst_name = params.inst_order[tmp_rc]
    inst_name = params.order.inst[inst_rc]

    // use tmp_rc
    // order_indexes[inst_rc] = inst_matrix.orders[ inst_name+ '_' + tmp_rc ];

    // order_indexes[inst_rc] = params.network[tmp_rc + '_nodes'].map(x => x[inst_name])
    order_indexes[inst_rc] = params.network[inst_rc + '_nodes']
                                   .map(x => {
                                     let inst_num_labels = params.labels['num_' + inst_rc] - 1
                                     let new_index = inst_num_labels - x.ini
                                     return new_index
                                   })
                                   // .map(x => x.ini)

    console.log(inst_rc)
    console.log(order_indexes[inst_rc])

  });

  // write first matrix row (e.g. column names)

  var matrix_string = '\t';
  var row_nodes = params.network.row_nodes;
  var col_nodes = params.network.col_nodes;

  // alternate column entry
  for (var c_i=0; c_i<order_indexes.col.length; c_i++){

    var inst_index = order_indexes.col[c_i];
    // console.log('inst_index', inst_index)

    var inst_col = col_nodes[inst_index];

    // console.log('inst_col', inst_col)
    var col_name = make_full_name(params, inst_col, 'col');

    if (c_i < order_indexes.col.length-1){
      matrix_string = matrix_string + col_name + '\t';
    } else {
      matrix_string = matrix_string + col_name ;
    }

  }

  var row_data;
  matrix_string = matrix_string + '\n';

  // console.log(order_indexes.row)

  // debugger

  // write matrix rows
  ////////////////////////

  underscore.each(order_indexes.row, function(inst_index){

    // row names
    // row_data = inst_matrix.matrix[inst_index].row_data;
    row_data = params.mat_data[inst_index]

    // var row_name = inst_matrix.matrix[inst_index].name;
    var inst_row = row_nodes[inst_index];

    // var row_name = inst_row.name;
    var row_name = make_full_name(params, inst_row, 'row');

    matrix_string = matrix_string + row_name + '\t';

    // alternate data entry
    for (var r_i=0; r_i<order_indexes.col.length; r_i++){

      // get the order
      var col_index = order_indexes.col[r_i];

      if (r_i < order_indexes.col.length-1){
        // matrix_string = matrix_string + String(row_data[col_index].value) + '\t';
        matrix_string = matrix_string + String(row_data[col_index]) + '\t';
      } else {
        // matrix_string = matrix_string + String(row_data[col_index].value);
        matrix_string = matrix_string + String(row_data[col_index]);
      }

    }

    matrix_string = matrix_string + '\n';

  });

  return matrix_string;

};