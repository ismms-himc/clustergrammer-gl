module.exports = function gen_text_zoom_par(params){

  var text_zoom = {};

  text_zoom.row = {};
  text_zoom.row.scaled_num = params.labels.num_row;
  text_zoom.row.reference = text_zoom.row.scaled_num;
  text_zoom.row.factor = 1;
  text_zoom.row.max_webgl_fs = 0.05;

  text_zoom.col = {};
  text_zoom.col.scaled_num = params.labels.num_col;
  text_zoom.col.reference = text_zoom.col.scaled_num;
  text_zoom.col.factor = 1;
  text_zoom.col.max_webgl_fs = 0.06;

  params.text_zoom = text_zoom;
};