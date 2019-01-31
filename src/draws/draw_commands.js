var draw_matrix_components = require('./draw_matrix_components');
var draw_axis_components = require('./draw_axis_components');
// var draw_tooltip_components = require('./draw_tooltip_components');
var draw_spillover_components = require('./draw_spillover_components');
var show_d3_tip = require('./../tooltip/show_d3_tip');

module.exports = function draw_commands(regl, params){

  // if (params.labels.draw_labels){
  //   console.log('\n***************');
  //   console.log('** draw_labels **');
  //   console.log('***************');
  // }

  // console.log('draw')
  // console.log(params.zoom_data.x.cursor_position, params.zoom_data.y.cursor_position)

  draw_matrix_components(regl, params);
  draw_axis_components(regl, params, 'row', params.labels.draw_labels);
  draw_axis_components(regl, params, 'col', params.labels.draw_labels);
  draw_spillover_components(regl, params);

  // clean tooltip
 // console.log(params.tooltip.in_bounds_tooltip)
  if (params.tooltip.show_tooltip && params.tooltip.in_bounds_tooltip && params.tooltip.on_canvas){

    // draw_tooltip_components(regl, params);
    show_d3_tip(params);

  }

  if (params.labels.draw_labels){
    // console.log('----- turn off draw_labels -----')
    params.labels.draw_labels = false;
  }

  // clean_tooltip
  // if (params.tooltip.show_tooltip){
  //   // console.log('----- turn off show tooltip ------')
  //   params.tooltip.show_tooltip = false;
  // }

};