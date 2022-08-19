import display_and_position_tooltip from "./displayAndPositionTooltip";
import makeTooltipText from "./makeTooltipText";
import remove_lost_tooltips from "./removeLostTooltips";

export default (function runShowTooltip(
  regl,
  params,
  mouseover,
  external_model
) {
  if (params.tooltip.permanent_tooltip === false) {
    remove_lost_tooltips();
    makeTooltipText(regl, params, mouseover, external_model);
    display_and_position_tooltip(params);
  }
});
