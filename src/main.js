/*

  clustergrammer-gl version 0.9.0

 */

var initialize_params = require('./params/initialize_params');
var initialize_regl = require('./params/initialize_regl');
var decompress_network = require('./params/decompress_network');
var initialize_containers = require('./initialize_viz/initialize_containers')
var run_viz = require('./draws/run_viz');

function clustergrammer_gl(args){

  console.log('################################');
  console.log('clustergrammer-gl version 0.9.0');
  console.log('################################');

  var cgm = {};

  // initialize regl
  var canvas_container = initialize_containers(args);
  var regl = initialize_regl(canvas_container);

  // initialize parameters
  var network = decompress_network(args.network);
  var params = initialize_params(regl, network);

  cgm.regl = regl;

  cgm.params = params;



  // id of container
  cgm.params.root = '#' + args.container.id;
  cgm.params.canvas_root = cgm.params.root + ' .canvas-container';
  cgm.params.base_container = args.container;
  cgm.params.canvas_container = canvas_container;

  require('./dendrogram/build_dendrogram_sliders')(cgm);

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

  run_viz(regl, params);

  // exposing methods during development
  ///////////////////////////////////////////
  //
  cgm.destroy_viz = require('./initialize_viz/destroy_viz');

  return cgm;

}

// necessary for exporting function
module.exports = clustergrammer_gl;