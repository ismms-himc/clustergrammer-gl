/*

  clustergrammer-gl version 0.9.0

 */

var pako = require('pako');
var reset_cameras = require('./cameras/reset_cameras');
var initialize_params = require('./params/initialize_params');
var initialize_regl = require('./params/initialize_regl');
var decompress_network = require('./params/decompress_network');

function clustergrammer_gl(args){

  console.log('################################');
  console.log('clustergrammer-gl version 0.9.0');
  console.log('################################');

  network = decompress_network(args.network);

  var base_container = args.container;

  // make control panel (needs to appear above canvas)
  d3.select(base_container)
    .append('div')
    .attr('class', 'control-container')
    .style('cursor', 'default');

  // make canvas container
  d3.select(base_container)
    .append('div')
    .attr('class', 'canvas-container')
    .style('position', 'absolute')
    .style('cursor', 'default');

  var canvas_container = d3.select(base_container)
                           .select('.canvas-container')[0][0];

  var inst_height = args.viz_height;
  var inst_width  = args.viz_width;

  d3.select(canvas_container)
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px');

  regl = initialize_regl(canvas_container);

  var params = initialize_params(regl, network);

  require('./draws/run_viz')(regl, params);

  var cgm = {};

  cgm.params = params;

  cgm.params.viz_height = inst_height;
  cgm.params.viz_width = inst_width;

  // id of container
  cgm.params.root = '#' + args.container.id;
  cgm.params.canvas_root = cgm.params.root + ' .canvas-container';
  cgm.params.base_container = args.container;
  cgm.params.canvas_container = canvas_container;

  require('./dendrogram/build_dendrogram_sliders')(regl, cgm);

  require('./control_panel/build_control_panel')(regl, cgm);

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

  // exposing methods during development
  ///////////////////////////////////////////
  //
  cgm.reset_cameras = reset_cameras;
  cgm.regl = regl;

  // working on re-building visualization
  cgm.run_viz = require('./draws/run_viz');
  cgm.initialize_regl = initialize_regl;

  return cgm;

}

// necessary for exporting function
module.exports = clustergrammer_gl;