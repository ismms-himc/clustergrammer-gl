import drawAxisComponents from "./drawAxisComponents";
import drawMatrixComponents from "./drawMatrixComponents";
import drawStaticComponents from "./drawStaticComponents";

export default function draw_webgl_layers(cgm) {
  const regl = cgm.regl;
  const params = cgm.params;
  drawMatrixComponents(regl, params);
  const draw_labels = params.labels.draw_labels;
  drawAxisComponents(regl, params, "row", draw_labels);
  drawAxisComponents(regl, params, "col", draw_labels);
  drawStaticComponents(regl, params);
}
