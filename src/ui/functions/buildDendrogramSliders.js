import { select } from "d3-selection";
import * as _ from "underscore";
import build_single_dendro_slider from "../../dendrogram/buildSingleDendroSlider";

export default function build_dendrogram_sliders(regl, store) {
  const state = store.getState();

  // Add sliders on top of the canvas
  // ///////////////////////////////////
  const slider_length = 130;
  // slider containers
  let axis_slider_container;
  // hardwiring dendro slider position
  _.each(["row", "col"], function (inst_axis) {
    axis_slider_container = select(
      state.visualization.rootElementId + " .canvas-container"
    )
      .append("svg")
      .style("height", slider_length + "px")
      .style("width", "20px")
      .style("position", "absolute")
      .attr("class", inst_axis + "_dendro_slider_svg")
      .attr("transform", function () {
        if (inst_axis === "col") {
          return "rotate(-90) scale(-1,1)";
        }
      });
    if (inst_axis === "row") {
      axis_slider_container.style("right", "-10px").style("top", "45px");
    } else {
      axis_slider_container.style("left", "110px").style("bottom", "-65px");
    }
    axis_slider_container
      .append("rect")
      .style("height", slider_length + "px")
      .style("width", "25px")
      .style("fill", "transparent");
    build_single_dendro_slider(regl, store, inst_axis);
  });
}
