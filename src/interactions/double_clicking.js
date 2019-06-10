var custom_label_reorder = require('./../reorders/custom_label_reorder');

module.exports = function double_clicking(regl, params){

  // Custom column reordering
  if (params.zoom_data.y.cursor_rel_min <=0 ){

    custom_label_reorder(regl, params, 'col');

  }

  else if (params.zoom_data.x.cursor_rel_min <=0){
    custom_label_reorder(regl, params, 'row');
  }
}