import * as d3 from "d3";
export default function ini_canvas_mouseover(cgm) {
  const params = cgm.params;
  d3.select(params.root + " .canvas-container canvas")
    .on("mouseover", function () {
      params.tooltip.on_canvas = true;
    })
    .on("mouseout", function () {
      params.tooltip.on_canvas = false;
    });
}
