import { select } from "d3-selection";

export default function initializeD3Tip(store, tooltip_fun) {
  const state = store.getState();
  const inst_selector = state.root + " .control-panel-background";
  const control_panel_bkg = select(inst_selector).node();
  state.control_panel_bkg = control_panel_bkg;

  tooltip_fun.show("tooltip", state.control_panel_bkg);

  // const d3_tip_width = parseFloat(
  //   d3.select(state.tooltip_id).style("width").replace("px", "")
  // );

  // const d3_tip_height = parseFloat(
  //   d3.select(state.tooltip_id).style("height").replace("px", "")
  // );

  // state.tooltip_ini_width = d3_tip_width;
  // state.tooltip_ini_height = d3_tip_height;

  tooltip_fun.hide();
  // const state = store.getState();

  // const tooltip_fun = d3Tip()
  //   .attr("id", state.tooltip?.tooltip_id?.replace("#", ""))
  //   .attr("class", "cgm-tooltip")
  //   .direction("sw")
  //   .html(function () {
  //     return "";
  //   });
  // // tooltip style
  // // ////////////////////////
  // select(state.tooltip.tooltip_id)
  //   .style("line-height", 1.5)
  //   .style("font-weight", "bold")
  //   .style("padding-top", "3px")
  //   .style("padding-bottom", "7px")
  //   .style("padding-left", "10px")
  //   .style("padding-right", "10px")
  //   .style("background", "rgba(0, 0, 0, 0.8)")
  //   .style("color", "#fff")
  //   .style("border-radius", "2px")
  //   .style("pointer-events", "none")
  //   .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
  //   .style("font-size", "12px");
  // // artifically initialize tooltip
  // // ///////////////////////////////////
  // const inst_selector =
  //   state.visualization.rootElementId + " .control-panel-background";
  // const control_panel_bkg = select(inst_selector).node();
  // if (control_panel_bkg) {
  //   tooltip_fun.show("tooltip", control_panel_bkg);
  //   tooltip_fun.hide();
  // }
  // return tooltip_fun;
}
