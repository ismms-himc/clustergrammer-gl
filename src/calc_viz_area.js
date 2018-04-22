module.exports = function calc_viz_area(params){

  // console.log('calc_viz_area');

  var zoom_data = params.zoom_data;

  // make a d3.scale to transition from 0px - 500px to -1, 1 space
  var mat_width = params.viz_dim.mat.width;
  var mat_height = params.viz_dim.mat.height;

  var pix_to_webgl = {};

  pix_to_webgl.x = d3.scale.linear();
  pix_to_webgl.x
    .domain([0, mat_height])
    .range([-0.5, 0.5])
    .clamp(true);

  /*

    Experimenting with scales to improve viz area calculation

  */

  pix_to_webgl.y = d3.scale.linear();
  pix_to_webgl.y
    .domain([0, mat_width])
    .range([0.5, -0.5])
    .clamp(true);

  var tmp_scale = 1.0 ;

  // panning is defined as negative pixel values
  var total_pan = {};
  total_pan.x_min = -zoom_data.x.total_pan_min;
  total_pan.x_max = mat_width * tmp_scale + zoom_data.x.total_pan_max;

  total_pan.y_min = -zoom_data.y.total_pan_min;
  total_pan.y_max = mat_width * tmp_scale + zoom_data.y.total_pan_max;

  var buffer_width = 0.0;

  var viz_area = {};
  viz_area.x_min = pix_to_webgl.x(total_pan.x_min) - buffer_width;
  viz_area.x_max = pix_to_webgl.x(total_pan.x_max) + buffer_width;

  /*
  experimenting with viz_area calc
  */

  viz_area.y_max = pix_to_webgl.y(total_pan.y_min) - buffer_width;
  viz_area.y_min = pix_to_webgl.y(total_pan.y_max) + buffer_width;

  // console.log('y_min', viz_area.y_min);
  // console.log('y_max', viz_area.y_max);

  params.viz_area = viz_area;

};