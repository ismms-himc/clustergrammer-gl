module.exports = function restrict_rel_min(cursor_rel_min, max_pix, zoom_data){

  cursor_rel_min = cursor_rel_min / zoom_data.total_zoom - zoom_data.total_pan_min;

  // if (cursor_rel_min < 0){
  //   cursor_rel_min = 0;
  // } else if (cursor_rel_min > max_pix){
  //   cursor_rel_min = max_pix;
  // }

  return cursor_rel_min;

};