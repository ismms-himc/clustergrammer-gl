import * as d3 from "d3";
import { mutateTooltipState } from "../../../state/reducers/tooltip/tooltipSlice.js";
import runShowTooltip from "../../../tooltip/runShowTooltip.js";
import { CANVAS_CONTAINER_CLASSNAME } from "../../ui.const.js";

export default function ini_canvas_mouseover(
  regl,
  store,
  container,
  catArgsManager,
  camerasManager,
  tooltip_fun
) {
  const dispatch = store.dispatch;
  d3.select(container)
    .select(`.${CANVAS_CONTAINER_CLASSNAME}`)
    .select("canvas")
    .on("mouseover", function (v) {
      const state = store.getState();
      if (state.tooltip.show_tooltip && state.tooltip.in_bounds_tooltip) {
        runShowTooltip(
          regl,
          store,
          catArgsManager,
          camerasManager,
          tooltip_fun
        );
      }
      dispatch(mutateTooltipState({ on_canvas: true }));
    })
    .on("mouseout", function () {
      dispatch(mutateTooltipState({ on_canvas: false }));
    });
}
