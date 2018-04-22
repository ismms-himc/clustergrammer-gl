var $ = require('jquery');

module.exports = function filter_visible_mat(arrs_orig, zoom_data){

  /* Array re-calculation plan */
  /*
    Only re-calculate the array if a certain amount of zooming/panning has
    occurred so that this will not slow things down too much
  */

  // make a d3.scale to transition from 0px - 500px to -1, 1 space
  var mat_width = 500;
  var mat_height = 500;

  var filter_at_zoom = 2;
  var check_total_zoom = zoom_data.y.total_zoom > filter_at_zoom * zoom_data.y.filter_zoom ;
  var check_zoom_in = zoom_data.y.inst_zoom > 1.0;

  // var check_total_zoom

  if (check_total_zoom && check_zoom_in){

    // reset filter_zoom
    zoom_data.y.filter_zoom = zoom_data.y.total_zoom;
    // console.log('filter', zoom_data.y.filter_zoom);

    var arrs = $.extend(true, {}, arrs_orig);

    var pix_to_webgl = {};

    pix_to_webgl.x = d3.scale.linear();
    pix_to_webgl.x
      .domain([0, mat_height])
      .range([-0.5, 0.5])
      .clamp(true);

    pix_to_webgl.y = d3.scale.linear();
    pix_to_webgl.y
      .domain([0, mat_width])
      .range([0.5, -0.5])
      .clamp(true);

    // panning is defined as negative pixel values
    var total_pan = {};
    total_pan.x_min = -zoom_data.x.total_pan_min;
    total_pan.x_max = mat_width + zoom_data.x.total_pan_max;

    total_pan.y_min = -zoom_data.y.total_pan_min;
    total_pan.y_max = mat_width + zoom_data.y.total_pan_max;

    var buffer_width = 0.025;

    var pan_webgl = {};
    pan_webgl.x_min = pix_to_webgl.x(total_pan.x_min) - buffer_width;
    pan_webgl.x_max = pix_to_webgl.x(total_pan.x_max) + buffer_width;

    pan_webgl.y_min = pix_to_webgl.y(total_pan.y_min) + buffer_width;
    pan_webgl.y_max = pix_to_webgl.y(total_pan.y_max) - buffer_width;

    // filtering based on position
    var keep_opacity = [];
    arrs.position_arr = _.filter(arrs.position_arr, function(d,i){

      var check_x_min = d[0] > pan_webgl.x_min;
      var check_x_max = d[0] < pan_webgl.x_max;

      // y increases from top to bottom
      var check_y_min = d[1] < pan_webgl.y_min;
      var check_y_max = d[1] > pan_webgl.y_max;

      if ( check_x_min && check_x_max && check_y_min && check_y_max){
        keep_opacity.push(arrs.opacity_arr[i]);
        return d;
        }
    });

    // transfer keep_opacity
    arrs.opacity_arr = keep_opacity;

  } else {


    // console.log('no - filter', zoom_data.y.filter_zoom);
    arrs = arrs_orig;
  }

  // if zooming out reset the total_zoom
  if (check_zoom_in === false){
    zoom_data.y.filter_zoom = 1; //  zoom_data.y.total_zoom;
  }

  // console.log(arrs.opacity_arr.length);

  return arrs;
};