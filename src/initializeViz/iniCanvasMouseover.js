import * as d3 from "d3";
import findMouseoverElement from "../interactions/findMouseoverElement";
import runShowTooltip from "../tooltip/runShowTooltip";

export default function ini_canvas_mouseover(cgm) {
  const params = cgm.params;
  d3.select(params.root + " .canvas-container canvas")
    .on("mouseover", function (ev) {
      const mouseover = findMouseoverElement(params, ev);
      if (params.tooltip.show_tooltip && params.tooltip.in_bounds_tooltip) {
        runShowTooltip(cgm.regl, params, mouseover);
      }
    })
    .on("mouseout", function () {
      params.tooltip.on_canvas = false;
    });
}
