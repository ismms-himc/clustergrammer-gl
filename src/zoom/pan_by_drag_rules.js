module.exports = function pan_by_drag_rules(zoom_data, viz_dim_heat){

  // do not allow simultaneous panning and zooming
  if (zoom_data.inst_zoom > 1){
    zoom_data.pan_by_drag = 0;
  }

  // restrict min pan_by_drag if necessary
  if (zoom_data.pan_by_drag > 0){
    if (zoom_data.total_pan_min + zoom_data.pan_by_drag >= 0){
      // push to edge
      zoom_data.pan_by_drag = -zoom_data.total_pan_min;
    }
  }

};