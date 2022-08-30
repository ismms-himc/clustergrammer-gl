import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import { Store } from "@reduxjs/toolkit";
import { select } from "d3-selection";
import { mutateTooltipState } from "../../../state/reducers/tooltip/tooltipSlice";
import { RootState } from "../../../state/store/store";
import { CANVAS_CONTAINER_CLASSNAME } from "../../ui.const";

export const TOOLTIP_ID = "cg-tooltip";

export const hideTooltip = () => {
  const tooltip = document.getElementById(TOOLTIP_ID);
  if (tooltip) {
    Object.assign(tooltip.style, {
      display: "none",
    });
  }
};

export default function ini_canvas_mouseover(
  store: Store<RootState>,
  container: any
) {
  const dispatch = store.dispatch;

  select(container)
    .select(`.${CANVAS_CONTAINER_CLASSNAME}`)
    .append("div")
    .attr("id", TOOLTIP_ID);

  const tooltip = document.getElementById(TOOLTIP_ID);
  if (tooltip) {
    Object.assign(tooltip.style, {
      position: "absolute",
      background: "gray",
      padding: "0.5rem",
      color: "white",
      "box-sizing": "border-box",
      display: "none",
    });
  }

  select(container)
    .select(`.${CANVAS_CONTAINER_CLASSNAME}`)
    .select("canvas")
    .on("mousemove", function ({ clientX, clientY }) {
      const state = store.getState();

      // show a tooltip if we're on a matrix cell
      if (state.tooltip.tooltip_type === "matrix-cell" && tooltip) {
        tooltip.textContent = state.tooltip.text;

        const virtualEl = {
          getBoundingClientRect() {
            return {
              width: 0,
              height: 0,
              x: clientX,
              y: clientY,
              left: clientX,
              right: clientX,
              top: clientY,
              bottom: clientY,
            };
          },
        };
        computePosition(virtualEl, tooltip, {
          placement: "right-start",
          middleware: [offset(5), flip(), shift()],
        }).then(({ x, y }) => {
          Object.assign(tooltip.style, {
            display: "block",
            top: `${y}px`,
            left: `${x}px`,
          });
        });
      } else {
        hideTooltip();
      }
      dispatch(mutateTooltipState({ on_canvas: true }));
    })
    .on("mouseout", function () {
      hideTooltip();
      dispatch(mutateTooltipState({ on_canvas: false }));
    });
}
