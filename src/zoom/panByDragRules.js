import { cloneDeep } from "lodash";

export default (function pan_by_drag_rules(zoom_data, viz_dim_heat) {
  const newZoomData = cloneDeep(zoom_data);
  // do not allow simultaneous panning and zooming
  if (newZoomData.inst_zoom > 1) {
    newZoomData.pan_by_drag = 0;
  }
  // restrict min pan_by_drag if necessary
  if (newZoomData.pan_by_drag > 0) {
    if (newZoomData.total_pan_min + newZoomData.pan_by_drag >= 0) {
      // push to edge
      newZoomData.pan_by_drag = -newZoomData.total_pan_min;
    }
  }
  // restrict max pan_by_drag if necessary
  if (newZoomData.pan_by_drag < 0) {
    if (newZoomData.total_pan_max - newZoomData.pan_by_drag >= 0) {
      // push to edge
      newZoomData.pan_by_drag = newZoomData.total_pan_max;
    }
  }

  // restrict effective position of mouse
  if (
    newZoomData.cursor_position <
    viz_dim_heat.min + newZoomData.viz_offcenter
  ) {
    newZoomData.cursor_position = viz_dim_heat.min + newZoomData.viz_offcenter;
  } else if (
    newZoomData.cursor_position >
    viz_dim_heat.max + newZoomData.heat_offset + newZoomData.viz_offcenter
  ) {
    newZoomData.cursor_position =
      viz_dim_heat.max + newZoomData.heat_offset + newZoomData.viz_offcenter;
  }

  return newZoomData;
});
