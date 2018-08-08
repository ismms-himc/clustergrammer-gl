/*

  Version 0.3.1

 */

// var filename = 'data/mult_view.json';

var run_viz = require('./run_viz');
var control = require('control-panel')

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

  var canvas_element = d3.select('#something').select('canvas')[0];

  var panel = control([
    {type: 'range', label: 'my range', min: 0, max: 100, initial: 20},
    // {type: 'range', label: 'log range', min: 0.1, max: 100, initial: 20, scale: 'log'},
    {type: 'text', label: 'my text', initial: 'my cool setting'},
    // {type: 'checkbox', label: 'my checkbox', initial: true},
    // {type: 'color', label: 'my color', format: 'rgb', initial: 'rgb(10,200,0)'},
    // {type: 'button', label: 'gimme an alert', action: function () {alert('hello!');}},
    // {type: 'select', label: 'select one', options: ['option 1', 'option 2'], initial: 'option 1'},
    // {type: 'multibox', label: 'check many', count: 3, initial: [true, false, true]}
  ],
    {theme: 'light', position: 'top-left', root:args.container}
    // {theme: 'light', position: 'top-left'}
  )

  return cgm;

}

// necessary for exporting function
module.exports = clustergrammer_gl;