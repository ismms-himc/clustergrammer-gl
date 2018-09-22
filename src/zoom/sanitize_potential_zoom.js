module.exports = function sanitize_potential_zoom(zd, zoom_restrict){

  var max_zoom = zoom_restrict.max;
  var min_zoom = zoom_restrict.min;

  // calc unsanitized ptz (potential-total-zoom)
  // checking this prevents the real total_zoom from going out of bounds
  var ptz = zd.total_zoom * zd.inst_zoom;

  // zooming within allowed range
  if (ptz < max_zoom && ptz > min_zoom){
    zd.total_zoom = ptz;
  }

  // Zoom above max
  else if (ptz >= max_zoom) {
    if (zd.inst_zoom < 1){
      zd.total_zoom = zd.total_zoom * zd.inst_zoom;
    } else {
      // bump zoom up to max
      zd.inst_zoom = max_zoom/zd.total_zoom;
      // set zoom to max
      zd.total_zoom = max_zoom;
    }
  }
  // Zoom below min
  else if (ptz <= min_zoom){
    if (zd.inst_zoom > 1){
      zd.total_zoom = zd.total_zoom * zd.inst_zoom;
    } else {

      // bump zoom down to min
      zd.inst_zoom =  min_zoom/zd.total_zoom;
      // set zoom to min
      zd.total_zoom = min_zoom;
    }
  }

};