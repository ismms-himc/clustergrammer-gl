import * as d3 from "d3";

export default function destroy_viz(cgm) {
  d3.select(cgm.params.base_container).selectAll("div").remove();
  cgm.regl.destroy();
  // remove tooltip
  d3.select(cgm.params.tooltip_id).remove();
}
