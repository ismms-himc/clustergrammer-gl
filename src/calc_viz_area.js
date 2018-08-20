module.exports = function calc_viz_area(params){

  // console.log('calc_viz_area');

  var zoom_data = params.zoom_data;

  // make a d3.scale to transition from 0px - 500px to -1, 1 space
  var mat_width = params.viz_dim.heat.width;
  var mat_height = params.viz_dim.heat.height;

  /*

    Experimenting with scales to improve viz area calculation

  */

  var pix_to_webgl = params.pix_to_webgl;

  // panning is defined as negative pixel values
  var total_pan = {};
  total_pan.x_min = -zoom_data.x.total_pan_min;
  total_pan.x_max = mat_width + zoom_data.x.total_pan_max;

  total_pan.y_min = -zoom_data.y.total_pan_min;
  total_pan.y_max = mat_height + zoom_data.y.total_pan_max;

  var buffer_width = 0.0;

  var viz_area = {};
  viz_area.x_min = pix_to_webgl.x(total_pan.x_min) - buffer_width - params.offcenter.x;
  // addition not necessary
  viz_area.x_max = pix_to_webgl.x(total_pan.x_max) + buffer_width + params.offcenter.x ;

  /*
  experimenting with viz_area calc
  */

  viz_area.y_max = pix_to_webgl.y(total_pan.y_min) - buffer_width + params.offcenter.y;
  // minus offset not necessary
  viz_area.y_min = pix_to_webgl.y(total_pan.y_max) + buffer_width - params.offcenter.y;

  // console.log('y_min', viz_area.y_min);
  // console.log('y_max', viz_area.y_max);

  params.viz_area = viz_area;

};