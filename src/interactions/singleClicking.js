import run_hide_tooltip from "../tooltip/runHideTooltip";
import runShowTooltip from "../tooltip/runShowTooltip";

export default function single_clicking(
  regl,
  state,
  dispatch,
  catArgsManager,
  tooltip_fun,
  mouseover
) {
  state.animation.last_click = state.animation.time;
  state.interaction.manual_update_cats = false;
  run_hide_tooltip(state, tooltip_fun, true);
  if (state.tooltip.tooltip_type.includes("-dendro")) {
    if (state.tooltip.permanent_tooltip === false) {
      runShowTooltip(regl, state, dispatch, catArgsManager, mouseover);
      state.tooltip.permanent_tooltip = true;
    }
  }
}
