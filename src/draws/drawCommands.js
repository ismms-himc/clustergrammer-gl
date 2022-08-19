let draw_webgl_layers = require("./drawWebglLayers");

module.exports = function draw_commands(cgm, external_model) {
  let regl = cgm.regl;
  let params = cgm.params;

  // if mousing over categories initialize all categories to low opacity
  var mousing_over_cat = false;
  if (params.tooltip.tooltip_type) {
    if (params.tooltip.tooltip_type.includes("-cat-")) {
      // This is required to updated category opacity when mousing over
      require("./../params/generateCatArgsArrs")(regl, params);

      params.int.need_reset_cat_opacity = true;
      mousing_over_cat = true;
    }
  }

  if (params.int.need_reset_cat_opacity && mousing_over_cat == false) {
    require("./../params/generateCatArgsArrs")(regl, params);
    params.int.need_reset_cat_opacity = false;
  }

  draw_webgl_layers(cgm);

  var tooltip = params.tooltip;

  // show tooltip if necessary
  if (tooltip.show_tooltip && tooltip.in_bounds_tooltip && tooltip.on_canvas) {
    require("./../tooltip/runShowTooltip")(cgm, external_model);
  }
  if (params.labels.draw_labels) {
    params.labels.draw_labels = false;
  }
};
