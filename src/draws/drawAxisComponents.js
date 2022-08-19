module.exports = function draw_axis_components(
  regl,
  params,
  inst_axis,
  calc_text_tri = false
) {
  var axis_dim;
  if (inst_axis === "col") {
    axis_dim = "x";
  } else {
    axis_dim = "y";
  }

  /* Axis Components */
  params.cameras[inst_axis + "-labels"].draw(() => {
    // viz aid triangles
    params.viz_aid_tri_args[inst_axis] =
      require("./../matrixLabels/makeVizAidTriArgs")(regl, params, inst_axis);
    regl(params.viz_aid_tri_args[inst_axis])();

    // drawing the label categories and dendrogram using the same camera as the
    // matrix (no special zooming required)
    _.each(params.cat_args[inst_axis], function (inst_cat_arg) {
      regl(inst_cat_arg)({
        interp_prop: require("./interpFun")(params),
        run_animation: params.ani.running,
      });
    });

    // only show the dendrogram if the current axis is in clust ordering
    if (
      params.order.inst[inst_axis] === "clust" &&
      params.order.new[inst_axis] === "clust"
    ) {
      regl(params.dendro.dendro_args[inst_axis])();
    }

    // make the arguments for the draw command
    var text_triangle_args;
    if (inst_axis === "col") {
      text_triangle_args = require("./../matrixLabels/makeColTextArgs")(
        regl,
        params,
        params.zoom_data.zoom_function
      );
    } else {
      text_triangle_args = require("./../matrixLabels/makeRowTextArgs")(
        regl,
        params,
        params.zoom_data.zoom_function
      );
    }

    if (calc_text_tri) {
      var num_viz_labels =
        params.labels["num_" + inst_axis] /
        params.zoom_data[axis_dim].total_zoom;

      if (
        num_viz_labels < params.max_num_text &&
        params.labels.queue.high[inst_axis].length == 0
      ) {
        require("./../params/calcVizArea")(params);

        // only regather if there are more labels than can be shown at once
        if (params.labels["num_" + inst_axis] >= params.max_num_text) {
          require("./../matrixLabels/gatherTextTriangles")(params, inst_axis);
        }
        regl(text_triangle_args)(params.text_triangles.draw[inst_axis]);
      }
    } else {
      if (params.text_triangles.draw[inst_axis] != false) {
        regl(text_triangle_args)(params.text_triangles.draw[inst_axis]);
      }
    }
  });
};
