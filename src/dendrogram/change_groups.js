var calc_dendro_triangles = require('./../dendrogram/calc_dendro_triangles');
var make_dendro_args = require('./../dendrogram/make_dendro_args');

/* Changes the groupings (x- and y-axis color bars).
 */
module.exports = function (regl, params, axis, slider_value) {

  params.dendro.update_dendro = true;

  // console.log('dendro group level in calc_dendro_triangles')
  // console.log(slider_value)

  // params.dendro.group_level[axis] = slider_value;
  params.dendro.group_info[axis] = calc_dendro_triangles(params, axis);
  params.dendro.dendro_args[axis] = make_dendro_args(regl, params, axis);

};
