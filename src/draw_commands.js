var draw_matrix_components = require('./draw_matrix_components');
var draw_row_components = require('./draw_row_components');
var draw_col_components = require('./draw_col_components');
var draw_spillover_components = require('./draw_spillover_components');
var draw_tooltip_components = require('./draw_tooltip_components');

module.exports = function draw_commands(regl, params){

  // if (params.slow_draw){
  //   console.log('\n***************');
  //   console.log('** slow draw **');
  //   console.log('***************');
  // }

  // console.log('draw')
  // console.log(params.zoom_data.x.cursor_position, params.zoom_data.y.cursor_position)

  draw_matrix_components(regl, params);
  draw_row_components(regl, params, params.slow_draw);
  draw_col_components(regl, params, params.slow_draw);
  draw_spillover_components(regl, params);

  if (params.show_tooltip){
    // console.log('draw tooltip component')
    draw_tooltip_components(regl, params);
  }

  if (params.slow_draw){
    // console.log('----- turn off slow draw -----')
    params.slow_draw = false;
  }

  if (params.show_tooltip){
    // console.log('----- turn off show tooltip ------')
    params.show_tooltip = false;
  }

};