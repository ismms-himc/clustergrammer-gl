var make_position_arr = require('./../matrix_cells/make_position_arr');
var make_cat_position_array = require('./../cats/make_cat_position_array');

module.exports = function run_reorder(inst_this, regl, cgm){

  var params = cgm.params;

  console.log('clicking control panel')

  d3.select(inst_this)
    .transition()
    .style('fill', 'blue');

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

};