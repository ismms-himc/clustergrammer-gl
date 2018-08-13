/*

  Version 0.3.1

 */

// var filename = 'data/mult_view.json';

var run_viz = require('./run_viz');
var control = require('control-panel')
// var

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

  var panel_width = 250;
  var panel_1 = control([
    {type: 'range', label: 'my range', min: 0, max: 100, initial: 20},
    // {type: 'range', label: 'log range', min: 0.1, max: 100, initial: 20, scale: 'log'},
    {type: 'text', label: 'my text', initial: 'something'},
    // {type: 'checkbox', label: 'my checkbox', initial: true},
    // {type: 'color', label: 'my color', format: 'rgb', initial: 'rgb(10,200,0)'},
    {type: 'button', label: 'reordering', action: function () {
      // alert('hello!');
      cgm.params.animation.run_switch = true;
    }},
    // {type: 'select', label: 'select one', options: ['option 1', 'option 2'], initial: 'option 1'},
    // {type: 'multibox', label: 'check many', count: 3, initial: [true, false, true]}
  ],
    {theme: 'light', root:control_container, title: 'Row Reordering', width:panel_width}
    // {theme: 'light', position: 'top-left'}
  );

  var panel_1 = control([
    {type: 'range', label: 'my range', min: 0, max: 100, initial: 20},
    // {type: 'range', label: 'log range', min: 0.1, max: 100, initial: 20, scale: 'log'},
    {type: 'text', label: 'my text', initial: 'something'},
    // {type: 'checkbox', label: 'my checkbox', initial: true},
    // {type: 'color', label: 'my color', format: 'rgb', initial: 'rgb(10,200,0)'},
    {type: 'button', label: 'reordering', action: function () {
      // alert('hello!');
      cgm.params.animation.run_switch = true;
    }},
    // {type: 'select', label: 'select one', options: ['option 1', 'option 2'], initial: 'option 1'},
    // {type: 'multibox', label: 'check many', count: 3, initial: [true, false, true]}
  ],
    {theme: 'light', root:control_container, title: 'Row Reordering', width:panel_width}
    // {theme: 'light', position: 'top-left'}
  );

  return cgm;

}

// necessary for exporting function
module.exports = clustergrammer_gl;