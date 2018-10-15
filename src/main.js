/*

  clustergrammer-gl version 0.6.3

 */

var run_viz = require('./draws/run_viz');
var build_control_panel = require('./control_panel/build_control_panel');
var build_dendrogram_sliders = require('./dendrogram/build_dendrogram_sliders')
var pako = require('pako');

function clustergrammer_gl(args){

  // console.log('################################');
  // console.log('clustergrammer-gl version 0.6.3');
  // console.log('################################');

  console.log('loading pako')
  console.log(pako)

  // debugger

  // comp_net = JSON.parse(args.network).compressed;

  // Decode base64 (convert ascii to binary)

  comp_net = JSON.parse(args.network).compressed
  var strData     = atob(comp_net);

  console.log(strData)

  // Convert binary string to character-number array
  var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});

  console.log(charData)

  // Turn number array into byte-array
  var binData     = new Uint8Array(charData);

  console.log(binData)

  // Pako magic
  var data        = pako.inflate(binData);

  console.log(data)

  // Convert gunzipped byteArray back to ascii string:
  var strData     = String.fromCharCode.apply(null, new Uint16Array(data));

  parse_1 = JSON.parse(strData)
  uncomp_net = JSON.parse(parse_1)

  // console.log(uncomp_net)

  // var network = args.network;
  var network = uncomp_net;
  var container = args.container;

  // make control panel first so it appears above canvas
  d3.select(container)
    .append('div')
    .attr('class', 'control-container')
    .style('cursor', 'default');

  d3.select(container)
    .append('div')
    .attr('class', 'canvas-container')
    .style('position', 'absolute')
    .style('cursor', 'default');

  var canvas_container = d3.select(container).select('.canvas-container')[0][0];


  var inst_height = args.viz_height;
  var inst_width  = args.viz_width;

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

  cgm.params.viz_height = inst_height;
  cgm.params.viz_width = inst_width;

  // id of container
  cgm.params.root = '#' + args.container.id;
  cgm.params.canvas_root = cgm.params.root + ' .canvas-container';
  cgm.params.container = args.container;
  cgm.params.canvas_container = canvas_container;

  build_dendrogram_sliders(regl, cgm);

  build_control_panel(regl, cgm);

  return cgm;

}

// necessary for exporting function
module.exports = clustergrammer_gl;