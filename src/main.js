/*

  clustergrammer-gl version 0.4.6

 */

var run_viz = require('./run_viz');
var make_position_arr = require('./make_position_arr');
var make_cat_position_array = require('./make_cat_position_array');

function clustergrammer_gl(args){

  console.log('################################');
  console.log('clustergrammer-gl version 0.4.6');
  console.log('################################');

  var network = args.network;
  var container = args.container;

  d3.select(container).append('div').attr('id', 'control-container')
  d3.select(container).append('div').attr('id', 'canvas-container')

  var control_container = d3.select(container).select('#control-container')[0][0];
  var canvas_container = d3.select(container).select('#canvas-container')[0][0];

  var inst_height = 100;
  var inst_width = 1000;

  var control_svg = d3.select(control_container)
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px')
    .append('svg')
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px');



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


  // Add sliders on top of the canvas
  /////////////////////////////////////
  var col_slider_container = d3.select(canvas_container)
    .append('svg')
    .style('height', '100px')
    .style('width', '40px')
    .style('position', 'absolute')
    .style('top', 400 + 'px')
    .style('left', inst_width - 15 + 'px')
    .attr('id', 'something!');

  col_slider_container
    .append('rect')
    .style('height', '100px')
    .style('width', '50px')
    .style('fill', 'red')
    .on('click', function(){
      console.log('clicking the red slider')
    })

  // Add control panel to the top
  ///////////////////////////////////////

  control_svg
    .append('rect')
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px')
    .style('fill', 'red')
    .on('click', function(){
      console.log('clicking control panel')

        // console.log('CLICKING', ev.type, 'reordering_columns', ev.x0, ev.y0)

        params.animation.run_switch = true;

        if (params.inst_order.col == 'clust'){
          console.log('set new_order to clust')
          params.new_order.col = 'rank'
        } else {
          console.log('set new_order to rank')
          params.new_order.col = 'clust'
        }

        // calculate new ordering
        params.arrs.position_arr.new = make_position_arr(params,
                                        params.new_order.row,
                                        params.new_order.col);

        params.matrix_args.regl_props.rects.attributes.pos_att_new = {
              buffer: regl.buffer(params.arrs.position_arr.new),
              divisor: 1
            };


        // update cat position arrays
        console.log('re-calculating col cat positions', params.new_order.col)
        console.log('---', params.cat_arrs.new.col[0][0])
        for (var cat_index = 0; cat_index < params.cat_num.col; cat_index++) {
          params.cat_arrs.new.col[cat_index] = make_cat_position_array(params, 'col', cat_index, params.new_order.col);

          // update the attribute
          params.cat_args.col[cat_index].attributes.cat_pos_att_new = {
              buffer: regl.buffer(params.cat_arrs.new.col[cat_index]),
              divisor: 1
          };
        }
        console.log('---', params.cat_arrs.new.col[0][0])

    });

  return cgm;

}

// necessary for exporting function
module.exports = clustergrammer_gl;