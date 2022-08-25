export default (function sanitize_inst_zoom(zd) {
  // first sanitize zooming out if already completely zoomed out
  let reset_cameras = false;
  if (zd.total_zoom === 1 && zd.inst_zoom < 1) {
    zd.inst_zoom = 1;
    // reset zoom
    reset_cameras = true;
  }

  return { zd, reset_cameras };
});
