module.exports = function pan_by_drag_rules(zoom_data, viz_dim_heat, inst_offset, offcenter){

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

  // restrict max pan_by_drag if necessary
  if (zoom_data.pan_by_drag < 0){
    if (zoom_data.total_pan_max - zoom_data.pan_by_drag >= 0){
      // push to edge
      zoom_data.pan_by_drag = zoom_data.total_pan_max;
    }
  }

  // if (axis === 'x'){
  //   console.log(zoom_data.cursor_position, viz_dim_heat.min, offcenter, viz_dim_heat.min + offcenter)
  // }

  // restrict effective position of mouse
  if (zoom_data.cursor_position < viz_dim_heat.min + offcenter){
    zoom_data.cursor_position = viz_dim_heat.min + offcenter;
    // if (axis === 'x'){
    //   console.log(axis, 'less than min cursor position', viz_dim_heat.min + offcenter);
    // }
  } else if (zoom_data.cursor_position > viz_dim_heat.max + inst_offset  + offcenter){

    zoom_data.cursor_position = viz_dim_heat.max + inst_offset + offcenter;

  }

};