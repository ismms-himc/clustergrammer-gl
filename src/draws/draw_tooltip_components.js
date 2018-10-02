// const make_tooltip_text_args = require('./../tooltip/make_tooltip_text_args');
// var calc_tooltip_background_triangles = require('./../tooltip/calc_tooltip_background_triangles');
var make_matrix_cell_tooltip = require('./../tooltip/make_matrix_cell_tooltip');

module.exports = function draw_tooltip_components(regl, params){

  make_matrix_cell_tooltip(params);

};