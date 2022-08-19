import make_full_name from "./makeFullName.js";
export default (function make_matrix_string(params) {
  let delimiter = params.download.delimiter_key[params.download.delimiter_name];
  // get order indexes
  var order_indexes = {};
  // write first matrix row (e.g. column names)
  ////////////////////////////////////////////////
  var matrix_string = delimiter;
  var row_nodes = params.network.row_nodes;
  var col_nodes = params.network.col_nodes;
  order_indexes.row = row_nodes;
  order_indexes.col = col_nodes;
  // alternate column entry
  Object.values(col_nodes).map((col, i) => {
    let col_name;
    if (params.download.delimiter_name === "tuple") {
      col_name = make_full_name(params, col, "col");
    } else {
      col_name = col.name;
      if (col_name.includes(": ")) {
        col_name = col_name.split(": ")[1];
      }
    }
    if (i < col_nodes.length - 1) {
      matrix_string = matrix_string + col_name + delimiter;
    } else {
      matrix_string = matrix_string + col_name;
    }
  });
  var row_data;
  let row_name;
  // write matrix rows
  ////////////////////////
  params.norm.zscore_status;
  if (params.norm.zscore_status === "non-zscored" && "mat_data_iz" in params) {
    inst_mat_data = params.mat_data_iz;
  } else {
    inst_mat_data = params.mat_data;
  }
  matrix_string = matrix_string + "\n";
  Object.values(col_nodes).map((col, i) => {
    let col_name;
    if (params.download.delimiter_name === "tuple") {
      col_name = make_full_name(params, col, "col");
    } else {
      col_name = col.name;
      if (col_name.includes(": ")) {
        col_name = col_name.split(": ")[1];
      }
    }
    if (i < col.length - 1) {
      matrix_string = matrix_string + col_name + delimiter;
    } else {
      matrix_string = matrix_string + col_name;
    }
  });
  Object.values(row_nodes).map((row, i) => {
    row_data = inst_mat_data[i];
    if (params.download.delimiter_name === "tuple") {
      row_name = make_full_name(params, row, "row");
    } else {
      row_name = row.name;
      if (row_name.includes(": ")) {
        row_name = row_name.split(": ")[1];
      }
    }
    matrix_string = matrix_string + row_name + delimiter;
    col_nodes.map((col, j) => {
      if (j < col_nodes.length - 1) {
        matrix_string = matrix_string + String(row_data[j]) + delimiter;
      } else {
        matrix_string = matrix_string + String(row_data[j]);
      }
    });
    matrix_string = matrix_string + "\n";
  });
  return matrix_string;
});
