module.exports = function sanitize_inst_zoom(zd){

  // first sanitize zooming out if already completely zoomed out
  if (zd.total_zoom == 1 && zd.inst_zoom < 1){
    zd.inst_zoom = 1;
  }

};
