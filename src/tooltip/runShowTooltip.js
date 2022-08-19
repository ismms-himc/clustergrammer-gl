import display_and_position_tooltip from "./displayAndPositionTooltip";
import make_tooltip_text from "./makeTooltipText";
import remove_lost_tooltips from "./removeLostTooltips";
export default (function run_show_tooltip(cgm, external_model) {
  const params = cgm.params;
  if (params.tooltip.permanent_tooltip === false) {
    remove_lost_tooltips();
    make_tooltip_text(cgm, external_model);
    display_and_position_tooltip(params);
  }
});
