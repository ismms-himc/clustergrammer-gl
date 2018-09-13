var make_cat_position_array = require('./../cats/make_cat_position_array');

module.exports = function reorder_cat_args(regl, cgm){

  var params = cgm.params;

  // can make more efficient by only checking which axis needs to be reordered

  _.each(['row', 'col'], function(inst_axis){

    // update cat position arrays
    for (var cat_index = 0; cat_index < params.cat_num[inst_axis]; cat_index++) {
      params.cat_arrs.new[inst_axis][cat_index] = make_cat_position_array(params, inst_axis, cat_index, params.new_order[inst_axis]);

      // update the attribute
      params.cat_args[inst_axis][cat_index].attributes.cat_pos_att_new = {
          buffer: regl.buffer(params.cat_arrs.new[inst_axis][cat_index]),
          divisor: 1
      };
    }

  });


};