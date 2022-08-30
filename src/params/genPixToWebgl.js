import { scaleLinear } from "d3-scale";

export default (function genPixToWebgl(viz_dim) {
  const pix_to_webgl = {};
  pix_to_webgl.x = scaleLinear();
  pix_to_webgl.x.domain([0, viz_dim.heat.width]).range([-0.5, 0.5]);
  pix_to_webgl.y = scaleLinear();
  pix_to_webgl.y.domain([0, viz_dim.heat.height]).range([0.5, -0.5]);
  return pix_to_webgl;
});
