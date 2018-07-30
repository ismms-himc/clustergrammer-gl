/*

  Version 0.3.1

 */

// var filename = 'data/mult_view.json';

var run_viz = require('./run_viz');

// global variables
// d3 = require('d3');

function clustergrammer_gl(args){

  console.log('################################');
  console.log('version 0.3.1');
  console.log('################################');

  var network = args.network;
  var container = args.container;

  var params = run_viz(container, network);

  var cgm = {};

  cgm.params = params;

  return cgm;

}

// necessary for exporting function
module.exports = clustergrammer_gl;