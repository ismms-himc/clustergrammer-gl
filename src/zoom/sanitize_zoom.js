module.exports = function sanitize_zoom(zoom_data){

  // first sanitize zooming out if already completely zoomed out
  if (zoom_data.total_zoom == 1 && zoom_data.inst_zoom < 1){
    zoom_data.inst_zoom = 1;
  }

};
