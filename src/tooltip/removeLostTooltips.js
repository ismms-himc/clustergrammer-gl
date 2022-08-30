// TODO: fix this usage here

import { select, selectAll } from "d3-selection";

export default function remove_lost_tooltips() {
  // remove any other tooltips left behind by another heatmap
  selectAll(".cgm-tooltip").each(function () {
    const inst_id = select(this).attr("id").split("_")[1];
    if (select("#" + inst_id).empty()) {
      select(this).style("display", "none");
    }
  });
}
