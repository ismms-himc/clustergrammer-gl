import * as d3 from "d3";
export default (function initializeD3Tip(params) {
  // artifically initialize tooltip
  // ///////////////////////////////////
  const inst_selector = params.root + " .control-panel-background";
  const control_panel_bkg = d3.select(inst_selector).node();
  params.control_panel_bkg = control_panel_bkg;
  params.tooltip_fun.show("tooltip", params.control_panel_bkg);
  const d3_tip_width = parseFloat(
    d3.select(params.tooltip_id).style("width").replace("px", "")
  );
  const d3_tip_height = parseFloat(
    d3.select(params.tooltip_id).style("height").replace("px", "")
  );
  params.tooltip_ini_width = d3_tip_width;
  params.tooltip_ini_height = d3_tip_height;
  params.tooltip_fun.hide();
});
