import * as d3 from "d3";
import d3Tip from "d3-tip";

export default function initializeD3Tip(state) {
  const tooltip_fun = d3Tip()
    .attr("id", state.tooltip?.tooltip_id?.replace("#", ""))
    .attr("class", "cgm-tooltip")
    .direction("sw")
    .html(function () {
      return "";
    });
  // tooltip style
  // ////////////////////////
  d3.select(state.tooltip.tooltip_id)
    .style("line-height", 1.5)
    .style("font-weight", "bold")
    .style("padding-top", "3px")
    .style("padding-bottom", "7px")
    .style("padding-left", "10px")
    .style("padding-right", "10px")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "#fff")
    .style("border-radius", "2px")
    .style("pointer-events", "none")
    .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style("font-size", "12px");
  // artifically initialize tooltip
  // ///////////////////////////////////
  // const inst_selector =
  //   state.visualization.rootElementId + " .control-panel-background";
  // const control_panel_bkg = d3.select(inst_selector).node();
  // if (control_panel_bkg) {
  //   // tooltip_fun.show("tooltip", control_panel_bkg);
  //   tooltip_fun.hide();
  // }
  return tooltip_fun;
}
