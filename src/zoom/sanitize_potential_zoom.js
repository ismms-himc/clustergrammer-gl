module.exports = function sanitize_potential_zoom(zoom_data, zoom_restrict){

  var max_zoom = zoom_restrict.max;
  var min_zoom = zoom_restrict.min;

  // calc unsanitized ptz (potential-total-zoom)
  // checking this prevents the real total_zoom from going out of bounds
  var ptz = zoom_data.total_zoom * zoom_data.inst_zoom;

  // zooming within allowed range
  if (ptz < max_zoom && ptz > min_zoom){
    zoom_data.total_zoom = ptz;
  }

  // Zoom above max
  else if (ptz >= max_zoom) {
    if (zoom_data.inst_zoom < 1){
      zoom_data.total_zoom = zoom_data.total_zoom * zoom_data.inst_zoom;
    } else {
      // bump zoom up to max
      zoom_data.inst_zoom = max_zoom/zoom_data.total_zoom;
      // set zoom to max
      zoom_data.total_zoom = max_zoom;
    }
  }
  // Zoom below min
  else if (ptz <= min_zoom){
    if (zoom_data.inst_zoom > 1){
      zoom_data.total_zoom = zoom_data.total_zoom * zoom_data.inst_zoom;
    } else {

      // bump zoom down to min
      zoom_data.inst_zoom =  min_zoom/zoom_data.total_zoom;
      // set zoom to min
      zoom_data.total_zoom = min_zoom;
    }
  }

};