// TODO: fix this usage here

import * as d3 from "d3";

export default function remove_lost_tooltips() {
  // remove any other tooltips left behind by another heatmap
  d3.selectAll(".cgm-tooltip").each(function () {
    const inst_id = d3.select(this).attr("id").split("_")[1];
    if (d3.select("#" + inst_id).empty()) {
      d3.select(this).style("display", "none");
    }
  });
}
