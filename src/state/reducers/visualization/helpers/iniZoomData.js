import * as _ from "underscore";

export default (function ini_zoom_data() {
  // organize zoom rules into x and y components
  const zoom_data = {};
  _.each(["x", "y"], function (inst_dim) {
    const inst_data = {};
    // total zooming (formerly tsx)
    inst_data.total_zoom = 1;
    // position of cursor (formerly x0)
    inst_data.cursor_position = 0;
    // total panning relative to the min
    inst_data.total_pan_min = 0;
    // total panning relative to the max
    inst_data.total_pan_max = 0;
    // pan_room (allowed negative panning)
    inst_data.pan_room = 0;
    // pan_by_zoom (formerly zdx)
    inst_data.pan_by_zoom = 0;
    inst_data.pan_by_drag = 0;
    inst_data.inst_zoom = 1;
    // zoom at which previous filtering was done (ini at 1)
    inst_data.filter_zoom = 1;
    // keep track of previous restrictions
    inst_data.prev_restrict = false;
    // delay viz area calculations until sufficient zooming has
    // occurred
    inst_data.zoom_step = 10;
    inst_data.show_text = false;
    // keep track of when zooming stops
    inst_data.still_zooming = false;
    // cursor position relative min
    inst_data.cursor_rel_min = 0;
    // add to zoom_data
    zoom_data[inst_dim] = inst_data;
  });
  return zoom_data;
});
