var make_cat_position_array = require('./../cats/make_cat_position_array');

module.exports = function reorder_cats(regl, cgm){

  var params = cgm.params;

  // update cat position arrays
  for (var cat_index = 0; cat_index < params.cat_num.col; cat_index++) {
    params.cat_arrs.new.col[cat_index] = make_cat_position_array(params, 'col', cat_index, params.new_order.col);

    // update the attribute
    params.cat_args.col[cat_index].attributes.cat_pos_att_new = {
        buffer: regl.buffer(params.cat_arrs.new.col[cat_index]),
        divisor: 1
    };
  }

};