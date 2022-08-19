import run_hide_tooltip from "../tooltip/runHideTooltip";
import runShowTooltip from "../tooltip/runShowTooltip";

export default function single_clicking(params, mouseover, external_model) {
  params.ani.last_click = params.ani.time;
  params.int.manual_update_cats = false;
  run_hide_tooltip(params, true);
  if (params.tooltip.tooltip_type.includes("-dendro")) {
    if (params.tooltip.permanent_tooltip === false) {
      runShowTooltip(params, mouseover, external_model);
      params.tooltip.permanent_tooltip = true;
    }
  }
}
