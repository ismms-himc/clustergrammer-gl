var custom_col_reorder = require('./../reorders/custom_col_reorder');
var custom_row_reorder = require('./../reorders/custom_row_reorder');

module.exports = function double_clicking(regl, params){

  // Custom column reordering
  if (params.zoom_data.y.cursor_rel_min <=0 ){

    custom_col_reorder(regl, params);

  }

  else if (params.zoom_data.x.cursor_rel_min <=0){
    custom_row_reorder(regl, params);
  }
}