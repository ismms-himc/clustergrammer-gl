var zoom_rules_low_mat = require("./../zoom/zoomRulesLowMat");
var find_mouseover_element = require("./findMouseoverElement");
var keep_track_of_interactions = require("./keepTrackOfInteractions");
var keep_track_of_mouseovers = require("./keepTrackOfMouseovers");

module.exports = function track_interaction_zoom_data(regl, params, ev) {
  var zoom_data = params.zoom_data;
  var zoom_restrict = params.zoom_restrict;
  var viz_dim = params.viz_dim;

  var interaction_types = ["wheel", "touch", "pinch"];

  if (ev.buttons || interaction_types.indexOf(ev.type) !== -1) {
    switch (ev.type) {
      case "wheel":
        ev.dsx = ev.dsy = Math.exp(-ev.dy / 100);
        ev.dx = ev.dy = 0;
        break;
    }

    // transfer data from ev to zoom_data
    zoom_data.x.inst_zoom = ev.dsx;
    zoom_data.x.pan_by_drag = ev.dx;
    zoom_data.x.cursor_position = ev.x0;

    zoom_data.y.inst_zoom = ev.dsy;
    zoom_data.y.pan_by_drag = ev.dy;
    zoom_data.y.cursor_position = ev.y0;

    var potential_zoom;
    /*
      Zoom Switch: adjust x/y zooming based on non-square matrices
    */
    // set up two-stage zooming
    if (zoom_data.y.total_zoom < zoom_restrict.y.ratio) {
      zoom_data.x.inst_zoom = 1;

      potential_zoom = zoom_data.y.total_zoom * zoom_data.y.inst_zoom;

      // check potential_zoom
      if (potential_zoom > zoom_restrict.y.ratio) {
        // bump x inst_zoom

        zoom_data.x.inst_zoom = potential_zoom / zoom_restrict.y.ratio;
      }
    } else if (zoom_data.x.total_zoom < zoom_restrict.x.ratio) {
      zoom_data.y.inst_zoom = 1;

      potential_zoom = zoom_data.x.total_zoom * zoom_data.x.inst_zoom;

      // check potential_zoom
      if (potential_zoom > zoom_restrict.x.ratio) {
        // bump x inst_zoom

        zoom_data.y.inst_zoom = potential_zoom / zoom_restrict.x.ratio;
      }
    }

    zoom_data.x = zoom_rules_low_mat(
      params,
      zoom_restrict.x,
      zoom_data.x,
      viz_dim.heat.x,
      viz_dim.mat.x,
      "x"
    );
    zoom_data.y = zoom_rules_low_mat(
      params,
      zoom_restrict.y,
      zoom_data.y,
      viz_dim.heat.y,
      viz_dim.mat.y,
      "y"
    );

    keep_track_of_interactions(params);
  } else if (ev.type === "mousemove") {
    // trying to keep track of interactions for mouseovers
    keep_track_of_mouseovers(params);

    find_mouseover_element(regl, params, ev);
  } else {
  }
};
