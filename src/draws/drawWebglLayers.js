module.exports = function draw_webgl_layers(cgm) {
  let regl = cgm.regl;
  let params = cgm.params;

  require("./drawMatrixComponents")(regl, params);
  var draw_labels = params.labels.draw_labels;
  require("./drawAxisComponents")(regl, params, "row", draw_labels);
  require("./drawAxisComponents")(regl, params, "col", draw_labels);
  require("./drawStaticComponents")(regl, params);
};
