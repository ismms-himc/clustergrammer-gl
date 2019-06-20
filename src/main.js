/*

  clustergrammer-gl version 0.9.0

 */

var initialize_params = require('./params/initialize_params');
var initialize_regl = require('./params/initialize_regl');
var decompress_network = require('./params/decompress_network');
var initialize_containers = require('./initialize_viz/initialize_containers');
var run_viz = require('./draws/run_viz');
var build_dendrogram_sliders = require('./dendrogram/build_dendrogram_sliders');

function clustergrammer_gl(args){

  console.log('################################');
  console.log('clustergrammer-gl version 0.9.0');
  console.log('################################');

  var cgm = {};

  cgm.initialize_params = initialize_params;
  cgm.decompress_network = decompress_network;
  cgm.initialize_regl = initialize_regl;
  cgm.initialize_containers = initialize_containers;

  // initialize regl
  cgm.canvas_container = cgm.initialize_containers(args);
  cgm.regl = cgm.initialize_regl();

  // initialize parameters
  var network = decompress_network(args.network);

  var params = cgm.initialize_params(args, cgm.canvas_container, cgm.regl, network);

  cgm.params = params;


  build_dendrogram_sliders(cgm);

  require('./control_panel/build_control_panel')(cgm);

  d3.select(cgm.params.root + ' .canvas-container canvas')
    .on('mouseover', function(){
      cgm.params.tooltip.on_canvas = true;
      // console.log(cgm.params.root, 'on canvas')
    })
    .on('mouseout', function(){
      // disable off canvas
      cgm.params.tooltip.on_canvas = false;
      // console.log(cgm.params.root, 'off canvas');
    });

  // run_viz(cgm);
  cgm.run_viz = run_viz;
  cgm.run_viz();

  // exposing methods during development
  ///////////////////////////////////////////
  //
  cgm.destroy_viz = require('./initialize_viz/destroy_viz');

  return cgm;

}

// necessary for exporting function
module.exports = clustergrammer_gl;