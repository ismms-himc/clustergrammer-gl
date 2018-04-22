module.exports = function ini_zoom_restrict(params){

  var num_row = params.num_row;
  var num_col = params.num_col;

  // working on improved matrix zooming
  var max_zoom = 40;
  var zoom_restrict = {};
  zoom_restrict.x = {};
  zoom_restrict.x.max = max_zoom;
  zoom_restrict.x.min = 1.0;
  zoom_restrict.x.ratio = 1;

  zoom_restrict.y = {};
  zoom_restrict.y.max = max_zoom;
  zoom_restrict.y.min = 1.0;
  zoom_restrict.y.ratio = 1;

  // increase max zoom in y or x direction
  if (num_row > num_col){
    zoom_restrict.y.max = zoom_restrict.y.max * ( num_row/num_col );
    zoom_restrict.y.ratio = num_row/num_col;
  } else if (num_col < num_row) {
    zoom_restrict.x.max = zoom_restrict.x.max * ( num_col/num_row );
    zoom_restrict.x.ratio = num_col/num_row;
  }

  return zoom_restrict;

};