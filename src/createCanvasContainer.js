import * as d3 from "d3";
import { CANVAS_CONTAINER_CLASSNAME } from "./ui/ui.const";

export const createCanvasContainer = (
  base_container,
  viz_height,
  viz_width
) => {
  let canvas_container = d3
    .select(base_container)
    .select(`.${CANVAS_CONTAINER_CLASSNAME}`);
  if (canvas_container.empty()) {
    // make canvas container
    d3.select(base_container)
      .append("div")
      .attr("class", CANVAS_CONTAINER_CLASSNAME)
      .style("position", "relative")
      .style("margin-right", "-25px")
      .style("margin-bottom", "-25px")
      .style("cursor", "default");
  }

  canvas_container = d3
    .select(base_container)
    .select(`.${CANVAS_CONTAINER_CLASSNAME}`)._groups[0][0];

  d3.select(canvas_container)
    .style("height", viz_height)
    .style("width", viz_width);

  return canvas_container;
};
