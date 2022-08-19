import drawAxisComponents from "./drawAxisComponents.js";
import drawMatrixComponents from "./drawMatrixComponents.js";
import drawStaticComponents from "./drawStaticComponents.js";

export default function draw_webgl_layers(cgm) {
  let regl = cgm.regl;
  let params = cgm.params;
  drawMatrixComponents(regl, params);
  var draw_labels = params.labels.draw_labels;
  drawAxisComponents(regl, params, "row", draw_labels);
  drawAxisComponents(regl, params, "col", draw_labels);
  drawStaticComponents(regl, params);
}
