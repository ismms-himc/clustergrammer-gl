import * as d3 from "d3";

export default (function generate_webgl_to_pix(viz_dim) {
  const webgl_to_pix = {};
  webgl_to_pix.x = d3.scaleLinear();
  webgl_to_pix.x.domain([-0.5, 0.5]).range([0, viz_dim.heat.width]).clamp(true);
  webgl_to_pix.y = d3.scaleLinear();
  webgl_to_pix.y
    .domain([0.5, -0.5])
    .range([0, viz_dim.heat.height])
    .clamp(true);
  return webgl_to_pix;
});
