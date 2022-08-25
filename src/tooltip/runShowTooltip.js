import display_and_position_tooltip from "./displayAndPositionTooltip";
import makeTooltipText from "./makeTooltipText";
import remove_lost_tooltips from "./removeLostTooltips";

export default (function runShowTooltip(
  regl,
  store,
  catArgsManager,
  camerasManager,
  tooltip_fun
) {
  const state = store.getState();
  if (state.tooltip.permanent_tooltip === false) {
    remove_lost_tooltips();
    makeTooltipText(
      regl,
      store,
      catArgsManager,
      camerasManager,
      tooltip_fun,
      state.interaction.mouseover
    );
    display_and_position_tooltip(state);
  }
});
