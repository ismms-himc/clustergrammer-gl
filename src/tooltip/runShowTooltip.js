import display_and_position_tooltip from "./displayAndPositionTooltip";
import makeTooltipText from "./makeTooltipText";
import remove_lost_tooltips from "./removeLostTooltips";

export default (function runShowTooltip(
  regl,
  state,
  dispatch,
  catArgsManager,
  tooltip_fun,
  mouseover
) {
  if (state.tooltip.permanent_tooltip === false) {
    remove_lost_tooltips();
    makeTooltipText(
      regl,
      state,
      dispatch,
      catArgsManager,
      tooltip_fun,
      mouseover
    );
    display_and_position_tooltip(state);
  }
});
