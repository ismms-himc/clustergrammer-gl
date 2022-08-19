export default (function sanitize_inst_zoom(params, zd) {
  // first sanitize zooming out if already completely zoomed out
  if (zd.total_zoom === 1 && zd.inst_zoom < 1) {
    zd.inst_zoom = 1;
    // reset zoom
    params.reset_cameras = true;
  }
});
