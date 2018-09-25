var ini_zoom_data = require('./../zoom/ini_zoom_data');
var make_cameras = require('./make_cameras');

module.exports = function reset_cameras(regl, params){

  // console.log('reset_cameras\n-------------------')
  params.reset_cameras = false;

  params.zoom_data = ini_zoom_data();
  make_cameras(regl, params);

  params.draw_labels = false;
  // params.first_frame = true;
  params.initialize_viz = true;
  // params.show_tooltip = false;
  params.interact.total = 0

};