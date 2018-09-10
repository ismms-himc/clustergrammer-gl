/*

  clustergrammer-gl version 0.4.6

 */

var run_viz = require('./run_viz');
var build_control_panel = require('./control_panel/build_control_panel');
var build_dendrogram_sliders = require('./dendrogram/build_dendrogram_sliders')

function clustergrammer_gl(args){

  console.log('################################');
  console.log('clustergrammer-gl version 0.4.6');
  console.log('################################');

  var network = args.network;
  var container = args.container;

  // make control panel first so it appears above canvas
  d3.select(container).append('div').attr('id', 'control-container')
  d3.select(container).append('div').attr('id', 'canvas-container')

  var canvas_container = d3.select(container).select('#canvas-container')[0][0];


  var inst_height = 1000;
  var inst_width = 1000;

  d3.select(canvas_container)
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px');

  var regl = require('regl')({
    extensions: ['angle_instanced_arrays'],
    container: canvas_container,
    // pixelRatio: window.devicePixelRatio/10
  });

  var params = run_viz(regl, network);

  var cgm = {};

  cgm.params = params;

  cgm.params.root = '#' + d3.select(canvas_container).attr('id');
  cgm.params.container = args.container;
  cgm.params.canvas_container = canvas_container;

  build_dendrogram_sliders(cgm);

  build_control_panel(regl, cgm);

  return cgm;

}

// necessary for exporting function
module.exports = clustergrammer_gl;