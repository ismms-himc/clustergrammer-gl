import * as d3 from "d3";

export default (function gen_pix_to_webgl(viz_dim) {
  const pix_to_webgl = {};
  pix_to_webgl.x = d3.scaleLinear();
  pix_to_webgl.x.domain([0, viz_dim.heat.width]).range([-0.5, 0.5]);
  pix_to_webgl.y = d3.scaleLinear();
  pix_to_webgl.y.domain([0, viz_dim.heat.height]).range([0.5, -0.5]);
  return pix_to_webgl;
});
