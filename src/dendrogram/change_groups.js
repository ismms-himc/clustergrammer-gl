// var make_dendro_triangles = require('./make_dendro_triangles');

/* Changes the groupings (x- and y-axis color bars).
 */
module.exports = function (cgm, inst_axis, slider_value) {

  var params = cgm.params;

  if (inst_axis==='row'){
    params.dendro.group_level.row = slider_value;
  } else if (inst_axis==='col'){
    params.dendro.group_level.col = slider_value;
  }

  // var is_change_group = true;
  // make_dendro_triangles(cgm, inst_axis, is_change_group);

  // console.log(slider_value);

};
