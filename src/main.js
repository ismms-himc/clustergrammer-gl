/*

  Version 0.3.1

 */

// var filename = 'data/mult_view.json';

var run_viz = require('./run_viz');
var reorder_panel = require('./reorder_panel')
var make_position_arr = require('./make_position_arr');

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

  var regl = require('regl')({
    extensions: ['angle_instanced_arrays'],
    container: canvas_container,
    // pixelRatio: window.devicePixelRatio/10
  });

  var params = run_viz(regl, network);

  var cgm = {};

  cgm.params = params;

  control_panels = {};

  control_panels.row = reorder_panel(regl, cgm.params, control_container, 'row');
  control_panels.col = reorder_panel(regl, cgm.params, control_container, 'col');

  control_panels.col.on('input', function(data){

      console.log('something happening', data)
      params.animation.run_switch = true;
      // params.new_order.row = data['row Order'];
      params.new_order.col = data['col Order'];

      // console.log(params.new_order.row, params.new_order.col)

      params.arrs.position_arr['new'] = make_position_arr(params,
                                      params.new_order.row,
                                      params.new_order.col);

      // var new_pos_arr = params.arrs.position_arr['new']

      params.matrix_args.regl_props.rects.attributes.pos_att_new = {
            buffer: regl.buffer(params.arrs.position_arr['new']),
            divisor: 1
          };

      /*
      Need to calcualte new position array when choosing new order
      */

  })

  return cgm;

}

// necessary for exporting function
module.exports = clustergrammer_gl;