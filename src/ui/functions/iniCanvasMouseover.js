import * as d3 from "d3";
import findMouseoverElement from "../../interactions/findMouseoverElement";
import runShowTooltip from "../../tooltip/runShowTooltip";

export default function ini_canvas_mouseover(
  regl,
  state,
  dispatch,
  catArgsManager,
  tooltip_fun
) {
  d3.select(state.visualization.rootElementId + " .canvas-container canvas")
    .on("mouseover", function (ev) {
      const mouseover = findMouseoverElement(state, dispatch, ev);
      if (state.tooltip.show_tooltip && state.tooltip.in_bounds_tooltip) {
        runShowTooltip(
          regl,
          state,
          dispatch,
          catArgsManager,
          tooltip_fun,
          mouseover
        );
      }
    })
    .on("mouseout", function () {
      state.tooltip.on_canvas = false;
    });
}
