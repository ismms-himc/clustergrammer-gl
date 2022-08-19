export default (function gen_text_zoom_par(params) {
  const text_zoom = {};
  const max_webgl_fs = {};
  max_webgl_fs.row = 0.05;
  max_webgl_fs.col = 0.06;
  _.each(["row", "col"], function (inst_axis) {
    text_zoom[inst_axis] = {};
    text_zoom[inst_axis].scaled_num = params.labels["num_" + inst_axis];
    text_zoom[inst_axis].reference = text_zoom[inst_axis].scaled_num;
    text_zoom[inst_axis].factor = 1;
    text_zoom[inst_axis].max_webgl_fs = max_webgl_fs[inst_axis];
  });
  params.text_zoom = text_zoom;
});
