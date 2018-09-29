var calc_dendro_triangles = require('./../dendrogram/calc_dendro_triangles');
var make_dendro_args = require('./../dendrogram/make_dendro_args');
// var make_dendro_triangles = require('./make_dendro_triangles');

/* Changes the groupings (x- and y-axis color bars).
 */
module.exports = function (regl, params, inst_axis, slider_value) {

  if (inst_axis==='row'){
    params.dendro.group_level.row = slider_value;
  } else if (inst_axis==='col'){
    params.dendro.group_level.col = slider_value;
  }

  // var is_change_group = true;
  // make_dendro_triangles(cgm, inst_axis, is_change_group);

  // console.log(slider_value);

  // this can probably be improved
  params.dendro.draw_dendro = true;

  params.dendro.group_level[inst_axis] = slider_value;
  params.dendro.group_info[inst_axis] = calc_dendro_triangles(params, inst_axis);
  params.dendro.dendro_args[inst_axis] = make_dendro_args(regl, params, inst_axis);

};
