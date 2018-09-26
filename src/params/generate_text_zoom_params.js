module.exports = function generate_text_zoom_params(params){

  params.text_zoom = {};

  // text zooming info
  params.text_zoom.row = {};
  params.text_zoom.row.scaled_num = params.labels.num_row;
  params.text_zoom.row.reference = params.text_zoom.row.scaled_num;
  params.text_zoom.row.factor = 1;
  params.text_zoom.row.max_webgl_fs = 0.05;

  params.text_zoom.col = {};
  params.text_zoom.col.scaled_num = params.labels.num_col;
  params.text_zoom.col.reference = params.text_zoom.col.scaled_num;
  params.text_zoom.col.factor = 1;
  params.text_zoom.col.max_webgl_fs = 0.06;

};