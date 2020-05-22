module.exports = function draw_webgl_layers(cgm){

  // console.log('draw_webgl_layers')

  let regl = cgm.regl
  let params = cgm.params

  require('./draw_matrix_components')(regl, params);
  var draw_labels = params.labels.draw_labels;
  require('./draw_axis_components')(regl, params, 'row', draw_labels);
  require('./draw_axis_components')(regl, params, 'col', draw_labels);
  require('./draw_static_components')(regl, params);

}