/*

  Version 0.2.3

 */

// var filename = 'data/mult_view.json';

// const
var run_viz = require('./run_viz');

// global variables
// d3 = require('d3');

function Clustergrammer2(args){

  console.log('################################');
  console.log('version 0.2.3');
  console.log('################################');

  var network = args.network;
  var container = args.container;

  var params = run_viz(container, network);

  var cgm = {};

  cgm.params = params;

  return cgm;

}

// necessary for exporting function
module.exports = Clustergrammer2;