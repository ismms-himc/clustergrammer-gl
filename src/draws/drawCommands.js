import generateCatArgsArrs from "../params/generateCatArgsArrs";
import runShowTooltip from "../tooltip/runShowTooltip";
import draw_webgl_layers from "./drawWebglLayers";
export default (function draw_commands(cgm, external_model) {
  const regl = cgm.regl;
  const params = cgm.params;
  // if mousing over categories initialize all categories to low opacity
  let mousing_over_cat = false;
  if (params.tooltip.tooltip_type) {
    if (params.tooltip.tooltip_type.includes("-cat-")) {
      // This is required to updated category opacity when mousing over
      generateCatArgsArrs(regl, params);
      params.int.need_reset_cat_opacity = true;
      mousing_over_cat = true;
    }
  }
  if (params.int.need_reset_cat_opacity && mousing_over_cat == false) {
    generateCatArgsArrs(regl, params);
    params.int.need_reset_cat_opacity = false;
  }
  draw_webgl_layers(cgm);
  const tooltip = params.tooltip;
  // show tooltip if necessary
  if (tooltip.show_tooltip && tooltip.in_bounds_tooltip && tooltip.on_canvas) {
    runShowTooltip(cgm, external_model);
  }
  if (params.labels.draw_labels) {
    params.labels.draw_labels = false;
  }
});
