import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import { Store } from "@reduxjs/toolkit";
import { select } from "d3-selection";
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

const showTooltip = ({
  clientX,
  clientY,
}: {
  clientX: number;
  clientY: number;
}) => {
  const tooltip = document.getElementById(TOOLTIP_ID);
  if (tooltip) {
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
      placement: "top",
      middleware: [offset(10), flip(), shift()],
    }).then(({ x, y }) => {
      Object.assign(tooltip.style, {
        display: "block",
        top: `${y}px`,
        left: `${x}px`,
      });
    });
  }
};

export default function ini_canvas_mouseover(
  store: Store<RootState>,
  container: any
) {
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
      "pointer-events": "none",
    });
  }

  document.addEventListener("mousemove", (e) => {
    const state = store.getState();

    // show a tooltip if we're on a matrix cell
    const tooltip = document.getElementById(TOOLTIP_ID);
    if (tooltip) {
      if (state.tooltip.tooltip_type !== "out-of-bounds") {
        if (tooltip.textContent != state.tooltip.text) {
          tooltip.textContent = state.tooltip.text;
        }
        showTooltip(e);
      } else {
        hideTooltip();
      }
    }
  });
}
