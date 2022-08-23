import * as d3 from "d3";

export default function initialize_containers(
  base_container,
  viz_width,
  viz_height
) {
  // make control panel (needs to appear above canvas)
  d3.select(base_container)
    .append("div")
    .attr("class", "control-container")
    .style("cursor", "default");
  // make canvas container
  d3.select(base_container)
    .append("div")
    .attr("class", "canvas-container")
    .style("position", "relative")
    .style("margin-right", "-25px")
    .style("margin-bottom", "-25px")
    .style("cursor", "default");
  const canvas_container = d3.select(base_container).select(".canvas-container")
    ._groups[0][0];
  const inst_height = viz_height;
  const inst_width = viz_width;
  d3.select(canvas_container)
    .style("height", inst_height)
    .style("width", inst_width);

  return canvas_container;
}
