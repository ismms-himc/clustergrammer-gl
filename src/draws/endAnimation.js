var d3 = require("d3");
module.exports = function end_animation(cgm) {
  let regl = cgm.regl;
  let params = cgm.params;
  params.ani.running = false;
  params.ani.run_animation = false;

  // transfer the new positions to the matrix args attributes
  params.matrix_args.regl_props.rects.attributes.pos_att_ini = {
    buffer: regl.buffer(params.arrs.position_arr.new),
    divisor: 1,
  };

  // transfer the new category positions to the cat args attributes
  _.each(["row", "col"], function (i_axis) {
    for (
      var cat_index = 0;
      cat_index < params.cat_data.cat_num[i_axis];
      cat_index++
    ) {
      // update the attribute
      params.cat_args[i_axis][cat_index].attributes.cat_pos_att_inst = {
        buffer: regl.buffer(params.cat_arrs.new[i_axis][cat_index]),
        divisor: 1,
      };
    }
    // transfer new order to old order
    params.order.inst[i_axis] = params.order.new[i_axis];
    // turn dendrogram slider back on if necessary
    if (params.order.inst[i_axis] === "clust") {
      d3.select("." + i_axis + "_dendro_slider_svg").style("display", "block");
    }
  });

  // transfer new order to text triangles
  // need to update text positions after animation
  _.each(["row", "col"], function (i_axis) {
    params.text_triangles.draw[i_axis] =
      require("./../matrixLabels/updateTextTriangleOrder")(params, i_axis);
    require("./../matrixLabels/calcTextOffsets")(params, i_axis);
  });

  // update ordered_labels
  require("./../matrixLabels/genOrderedLabels")(cgm);
};
