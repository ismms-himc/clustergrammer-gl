import * as d3 from "d3";
export default (function destroy_viz() {
  d3.select(this.params.base_container).selectAll("div").remove();
  this.regl.destroy();
  // remove tooltip
  d3.select(this.params.tooltip_id).remove();
});
