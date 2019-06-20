/*

  clustergrammer-gl version 0.9.0

 */

function clustergrammer_gl(args){

  console.log('################################');
  console.log('clustergrammer-gl version 0.9.0');
  console.log('################################');

  var cgm = {};

  cgm.args = args;

  cgm.initialize_params = require('./params/initialize_params');
  cgm.decompress_network = require('./params/decompress_network');
  cgm.initialize_regl = require('./params/initialize_regl');
  cgm.initialize_containers = require('./initialize_viz/initialize_containers');
  cgm.build_dendrogram_sliders = require('./dendrogram/build_dendrogram_sliders');;
  cgm.build_control_panel = require('./control_panel/build_control_panel');
  cgm.run_viz = require('./draws/run_viz');
  cgm.destroy_viz = require('./initialize_viz/destroy_viz');
  cgm.ini_canvas_mouseover = require('./initialize_viz/ini_canvas_mouseover')

  // initialize contiainers and regl
  cgm.initialize_containers();
  cgm.initialize_regl();

  // initialize network
  cgm.decompress_network(cgm.args.network);

  // define parameters and run visualization
  cgm.initialize_params();
  cgm.build_control_panel();
  cgm.ini_canvas_mouseover();
  cgm.run_viz();

  return cgm;
}

// necessary for exporting function
module.exports = clustergrammer_gl;