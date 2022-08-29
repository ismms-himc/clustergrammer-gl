import make_full_name from "./makeFullName";

export default (function make_matrix_string(state) {
  const delimiter = state.download.delimiter_key[state.download.delimiter_name];
  // get order indexes
  const order_indexes = {};
  // write first matrix row (e.g. column names)
  // //////////////////////////////////////////////
  let matrix_string = delimiter;
  const row_nodes = state.network.row_nodes;
  const col_nodes = state.network.col_nodes;
  order_indexes.row = row_nodes;
  order_indexes.col = col_nodes;
  // alternate column entry
  Object.values(col_nodes).forEach((col, i) => {
    let col_name;
    if (state.download.delimiter_name === "tuple") {
      col_name = make_full_name(state, col, "col");
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
  let row_data;
  let row_name;
  // write matrix rows
  // //////////////////////
  let inst_mat_data;
  if (
    state.network.norm.zscore_status === "non-zscored" &&
    "mat_iz" in state.network
  ) {
    inst_mat_data = state.mat_data_iz;
  } else {
    inst_mat_data = state.network.mat;
  }
  matrix_string = matrix_string + "\n";
  Object.values(col_nodes).forEach((col, i) => {
    let col_name;
    if (state.download.delimiter_name === "tuple") {
      col_name = make_full_name(state, col, "col");
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
  Object.values(row_nodes).forEach((row, i) => {
    row_data = inst_mat_data[i];
    if (state.download.delimiter_name === "tuple") {
      row_name = make_full_name(state, row, "row");
    } else {
      row_name = row.name;
      if (row_name.includes(": ")) {
        row_name = row_name.split(": ")[1];
      }
    }
    matrix_string = matrix_string + row_name + delimiter;
    col_nodes.forEach((_, j) => {
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
