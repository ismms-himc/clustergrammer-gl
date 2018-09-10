var make_position_arr = require('./../make_position_arr');
var make_cat_position_array = require('./../make_cat_position_array');

module.exports = function build_control_panel(regl, cgm){

  var params = cgm.params;

  console.log('building control panel')

// Add control panel to the top
  ///////////////////////////////////////

  var control_container = d3.select(cgm.params.container).select('#control-container')[0][0];
  var inst_height = 100;
  var inst_width = 1000;

  var control_svg = d3.select(control_container)
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px')
    .append('svg')
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px');

  control_svg
    .append('rect')
    .style('height',inst_height + 'px')
    .style('width',inst_width+'px')
    .style('position', 'absolute')
    .style('fill', 'red')
    .style('opacity', 0.5)
    .on('click', function(){

      console.log('clicking control panel')

      d3.select(this)
        .transition()
        .style('fill', 'blue')
        // .style('height', '150px');

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


};