/*

  clustergrammer-gl version 0.4.0

 */

// var filename = 'data/mult_view.json';

var run_viz = require('./run_viz');
var reorder_panel = require('./reorder_panel')
var make_position_arr = require('./make_position_arr');
var dendro_panel = require('./dendro_panel');

function clustergrammer_gl(args){

  console.log('################################');
  console.log('clustergrammer-gl version 0.4.0');
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

  var regl = require('regl')({
    extensions: ['angle_instanced_arrays'],
    container: canvas_container,
    // pixelRatio: window.devicePixelRatio/10
  });

  var params = run_viz(regl, network);

  var cgm = {};

  cgm.params = params;

  panels = {};
  panels.reorder = {};
  panels.dendro = {};

  panels.reorder.row = reorder_panel(regl, cgm.params, control_container, 'row');
  panels.reorder.col = reorder_panel(regl, cgm.params, control_container, 'col');
  panels.dendro.row = dendro_panel(regl, cgm.params, control_container, 'row');
  panels.dendro.col = dendro_panel(regl, cgm.params, control_container, 'col');

  panels.reorder.row.on('input', function(data){

      console.log('reordering rows', data)
      params.animation.run_switch = true;
      params.new_order.row = data['row Order'];

      params.arrs.position_arr['new'] = make_position_arr(params,
                                      params.new_order.row,
                                      params.new_order.col);

      params.matrix_args.regl_props.rects.attributes.pos_att_new = {
            buffer: regl.buffer(params.arrs.position_arr['new']),
            divisor: 1
          };

  });

  panels.reorder.col.on('input', function(data){

      console.log('reordering columns', data)
      params.animation.run_switch = true;
      params.new_order.col = data['col Order'];

      params.arrs.position_arr['new'] = make_position_arr(params,
                                      params.new_order.row,
                                      params.new_order.col);

      params.matrix_args.regl_props.rects.attributes.pos_att_new = {
            buffer: regl.buffer(params.arrs.position_arr['new']),
            divisor: 1
          };

  });


  return cgm;

}

// necessary for exporting function
module.exports = clustergrammer_gl;