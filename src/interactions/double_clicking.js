var custom_label_reorder = require('./../reorders/custom_label_reorder');

module.exports = function double_clicking(regl, params){

// params.tooltip.tooltip_type
if (params.tooltip.tooltip_type === 'col-label'){
  custom_label_reorder(regl, params, 'col');
}
if (params.tooltip.tooltip_type === 'row-label'){
    custom_label_reorder(regl, params, 'row');
  }

}