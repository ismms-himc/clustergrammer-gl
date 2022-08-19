import make_tooltip_text from "./makeTooltipText.js";
import remove_lost_tooltips from "./removeLostTooltips.js";
import display_and_position_tooltip from "./displayAndPositionTooltip.js";
export default (function run_show_tooltip(cgm, external_model) {
  let params = cgm.params;
  if (params.tooltip.permanent_tooltip === false) {
    remove_lost_tooltips();
    make_tooltip_text(cgm, external_model);
    display_and_position_tooltip(params);
  }
});
