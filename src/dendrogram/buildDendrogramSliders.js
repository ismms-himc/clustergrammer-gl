var d3 = require("d3");
var build_single_dendro_slider = require("./buildSingleDendroSlider");

module.exports = function build_dendrogram_sliders() {
  var cgm = this;
  var params = cgm.params;

  // Add sliders on top of the canvas
  /////////////////////////////////////
  var slider_length = 130;

  // slider containers
  var axis_slider_container;

  // hardwiring dendro slider position
  _.each(["row", "col"], function (inst_axis) {
    axis_slider_container = d3
      .select(params.root + " .canvas-container")
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

    build_single_dendro_slider(cgm, inst_axis);
  });
};
