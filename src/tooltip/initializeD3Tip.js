import * as d3 from "d3";

export default function initializeD3Tip(state, tooltip_fun) {
  // artifically initialize tooltip
  // ///////////////////////////////////
  const inst_selector =
    state.visualization.rootElementId + " .control-panel-background";
  const control_panel_bkg = d3.select(inst_selector).node();
  tooltip_fun.show("tooltip", control_panel_bkg);
  tooltip_fun.hide();
}
