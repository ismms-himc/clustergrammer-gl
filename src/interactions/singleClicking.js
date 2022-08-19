import run_hide_tooltip from "../tooltip/runHideTooltip.js";
import runShowTooltip from "../tooltip/runShowTooltip.js";

export default function single_clicking(cgm, params, external_model) {
  params.ani.last_click = params.ani.time;
  params.int.manual_update_cats = false;
  run_hide_tooltip(params, true);
  // debugger
  if (params.tooltip.tooltip_type.includes("-dendro")) {
    if (params.tooltip.permanent_tooltip === false) {
      runShowTooltip(cgm, external_model);
      params.tooltip.permanent_tooltip = true;
    }
  }
  if (params.is_widget) {
    cgm.widget_callback(external_model);
  }
}
