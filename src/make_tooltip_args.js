module.exports = function make_tooltip_args(params){

  console.log('rel min', params.mouseover.row_name, params.mouseover.col_name);

  /*

  Need to calculate the arguments and triangles for the tooltip draw command,
  which depending on the mouseover statis will or will not draw a tooltip in the
  larger draw_commands function. We do not want to run any draw commands later
  since they will re-draw only a subset of the visualization.

  */


};