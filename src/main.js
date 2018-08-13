/*

  Version 0.3.1

 */

// var filename = 'data/mult_view.json';

var run_viz = require('./run_viz');
var control = require('control-panel')
var reorder_panel = require('./reorder_panel')

function clustergrammer_gl(args){


  console.log('################################');
  console.log('version 0.3.1');
  console.log('################################');

  var network = args.network;
  var container = args.container;

  d3.select(container).append('div').attr('id', 'control-container')
  d3.select(container).append('div').attr('id', 'canvas-container')

  var control_container = d3.select(container).select('#control-container')[0][0];
  var canvas_container = d3.select(container).select('#canvas-container')[0][0];

  var inst_height = 1000;
  var inst_width = 1000;

  d3.select(control_container)
    // .style('height',inst_height + 'px')
    .style('width',inst_width+'px')
    .style('display', 'flex')

  d3.select(canvas_container)
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px')

  var params = run_viz(canvas_container, network);

  var cgm = {};

  cgm.params = params;

  reorder_panel(cgm.params, control_container, 'row');
  reorder_panel(cgm.params, control_container, 'col');

  return cgm;

}

// necessary for exporting function
module.exports = clustergrammer_gl;