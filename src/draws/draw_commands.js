module.exports = function draw_commands(regl, params){

  var draw_labels = params.labels.draw_labels;
  require('./draw_matrix_components')(regl, params);
  require('./draw_axis_components')(regl, params, 'row', draw_labels);
  require('./draw_axis_components')(regl, params, 'col', draw_labels);
  require('./draw_static_components')(regl, params);

  var tooltip = params.tooltip;
  if (tooltip.show_tooltip && tooltip.in_bounds_tooltip && tooltip.on_canvas){
    require('./../tooltip/show_d3_tip')(params);
  }
  if (params.labels.draw_labels){
    params.labels.draw_labels = false;
  }
};