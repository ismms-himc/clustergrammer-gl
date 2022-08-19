var make_full_name = require("./makeFullName");

module.exports = function make_matrix_string(params) {
  let delimiter = params.download.delimiter_key[params.download.delimiter_name];

  // get order indexes
  var order_indexes = {};

  // write first matrix row (e.g. column names)
  ////////////////////////////////////////////////
  var matrix_string = delimiter;
  var row_nodes = params.network.row_nodes;
  var col_nodes = params.network.col_nodes;

  // alternate column entry
  for (var c_i = 0; c_i < order_indexes.col.length; c_i++) {
    var inst_index = order_indexes.col[c_i];

    var inst_col = col_nodes[inst_index];

    let col_name;
    if (params.download.delimiter_name === "tuple") {
      col_name = make_full_name(params, inst_col, "col");
    } else {
      col_name = inst_col.name;
      if (col_name.includes(": ")) {
        col_name = col_name.split(": ")[1];
      }
    }

    if (c_i < order_indexes.col.length - 1) {
      matrix_string = matrix_string + col_name + delimiter;
    } else {
      matrix_string = matrix_string + col_name;
    }
  }

  var row_data;
  let row_name;
  var inst_row;
  // write matrix rows
  ////////////////////////

  params.norm.zscore_status;

  if (params.norm.zscore_status === "non-zscored" && "mat_data_iz" in params) {
    inst_mat_data = params.mat_data_iz;
  } else {
    inst_mat_data = params.mat_data;
  }

  matrix_string = matrix_string + "\n";
  order_indexes.row.forEach((inst_index) => {
    row_data = inst_mat_data[inst_index];
    inst_row = row_nodes[inst_index];

    if (params.download.delimiter_name === "tuple") {
      row_name = make_full_name(params, inst_row, "row");
    } else {
      row_name = inst_row.name;

      if (row_name.includes(": ")) {
        row_name = row_name.split(": ")[1];
      }
    }
    matrix_string = matrix_string + row_name + delimiter;
    for (var r_i = 0; r_i < order_indexes.col.length; r_i++) {
      var col_index = order_indexes.col[r_i];
      if (r_i < order_indexes.col.length - 1) {
        matrix_string = matrix_string + String(row_data[col_index]) + delimiter;
      } else {
        matrix_string = matrix_string + String(row_data[col_index]);
      }
    }
    matrix_string = matrix_string + "\n";
  });

  return matrix_string;
};
