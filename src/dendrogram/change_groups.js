// var make_dendro_triangles = require('./make_dendro_triangles');

/* Changes the groupings (x- and y-axis color bars).
 */
module.exports = function (cgm, inst_rc, slider_value) {

  var params = cgm.params;

  if (inst_rc==='row'){
    params.dendro.group_level.row = slider_value;
  } else if (inst_rc==='col'){
    params.dendro.group_level.col = slider_value;
  }

  // var is_change_group = true;
  // make_dendro_triangles(cgm, inst_rc, is_change_group);

  console.log(slider_value);

};
