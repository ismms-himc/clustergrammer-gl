module.exports = function ini_zoom_restrict(params){

  var inst_axis = 'row';
  var num_row = params.labels['num_' + inst_axis];
  inst_axis = 'col';
  var num_col = params.labels['num_' + inst_axis];

  // working on improved matrix zooming
  var max_zoom = params.max_zoom;
  var zoom_restrict = {};
  zoom_restrict.x = {};
  zoom_restrict.x.max = max_zoom;
  zoom_restrict.x.min = 1.0;
  zoom_restrict.x.ratio = 1.0;

  zoom_restrict.y = {};
  zoom_restrict.y.max = max_zoom;
  zoom_restrict.y.min = 1.0;
  zoom_restrict.y.ratio = 1.0;

  var col_vs_row_space = (num_col/params.viz_dim.heat.width)/
                         (num_row/params.viz_dim.heat.height);

  // increase max zoom in y or x direction
  if (num_row > num_col){
    zoom_restrict.y.max = zoom_restrict.y.max * ( 1/col_vs_row_space );
    zoom_restrict.y.ratio = 1/col_vs_row_space;
  } else if (num_col > num_row) {
    zoom_restrict.x.max = zoom_restrict.x.max * col_vs_row_space;
    zoom_restrict.x.ratio = col_vs_row_space;
  }

  return zoom_restrict;

};