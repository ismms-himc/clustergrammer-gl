import vec4 from "gl-vec4";

export default function camera_interaction(
  store,
  ev,
  viz_component,
  mInvViewport,
  mat4,
  mView,
  emitter,
  dViewport,
  mViewport
) {
  switch (ev.type) {
    case "wheel":
      ev.dsx = ev.dsy = Math.exp(-ev.dy / 100);
      ev.dx = ev.dy = 0;
      break;
  }
  if (ev.buttons || ["wheel", "touch", "pinch"].indexOf(ev.type) !== -1) {
    /*
        Sanitize zoom data components
        */
    const {
      visualization: { zoom_data },
    } = store.getState();
    let inst_x_zoom = zoom_data.x.inst_zoom;
    let inst_x_pan_by_zoom = zoom_data.x.pan_by_zoom;
    let inst_x_pan_by_drag = zoom_data.x.pan_by_drag;
    let inst_y_zoom = zoom_data.y.inst_zoom;
    let inst_y_pan_by_zoom = zoom_data.y.pan_by_zoom;
    let inst_y_pan_by_drag = zoom_data.y.pan_by_drag;
    if (viz_component === "row-labels") {
      inst_x_zoom = 1;
      inst_x_pan_by_drag = 0;
      inst_x_pan_by_zoom = 0;
    }
    if (viz_component === "col-labels") {
      inst_y_zoom = 1;
      inst_y_pan_by_drag = 0;
      inst_y_pan_by_zoom = 0;
    }
    if (viz_component === "static") {
      inst_x_zoom = 1;
      inst_x_pan_by_drag = 0;
      inst_x_pan_by_zoom = 0;
      inst_y_zoom = 1;
      inst_y_pan_by_drag = 0;
      inst_y_pan_by_zoom = 0;
    }
    ev.preventDefault();
    dViewport[0] = inst_x_zoom;
    dViewport[1] = 0;
    dViewport[2] = 0;
    dViewport[3] = 0;
    dViewport[4] = 0;
    dViewport[5] = inst_y_zoom;
    dViewport[6] = 0;
    dViewport[7] = 0;
    dViewport[8] = 0;
    dViewport[9] = 0;
    dViewport[10] = 1;
    dViewport[11] = 0;
    dViewport[12] = inst_x_pan_by_zoom + inst_x_pan_by_drag;
    dViewport[13] = inst_y_pan_by_zoom + inst_y_pan_by_drag;
    dViewport[14] = 0;
    dViewport[15] = 1;
    mat4.multiply(dViewport, dViewport, mViewport);
    mat4.multiply(dViewport, mInvViewport, dViewport);
    mat4.multiply(mView, dViewport, mView);
    // var dirty = true;
  }
  const xy = vec4.transformMat4(
    [],
    vec4.transformMat4([], [ev.x0, ev.y0, 0, 1], mInvViewport),
    mat4.invert([], mView)
  );
  ev.x = xy[0];
  ev.y = xy[1];
  emitter.emit("move", ev);
}
