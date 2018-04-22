var m3 = require('./mat3_transform');

module.exports = function make_row_text_triangle_args(regl, params, zoom_function){

  // prevent text from getting too large when zooming
  params.text_scale.row = d3.scale.linear()
      .domain([1, 10])
      .range([1, 10/params.allowable_zoom_factor]);

  // console.log('scaled_num', params.text_zoom.row.scaled_num);

  // /* Row Text */
  // // update text information with zooming
  // params.text_zoom.row.scaled_num = params.text_zoom.row.reference *
  //                                   // reduce text size when zooming
  //                                   params.text_scale.row(params.zoom_data.y.total_zoom);

  // var row_x_offset = d3.scale.linear()
  //   .domain([50, 100])
  //   .range([-26.1, -53]);

  // smaller scale_y -> larger text
  var tmp_reduce_text_factor = 3;
  var scale_y = params.text_zoom.row.scaled_num * tmp_reduce_text_factor;

  // console.log('scale_y', scale_y);

  var scale_x = params.zoom_data.y.total_zoom;

  // var x_offset = row_x_offset(params.text_zoom.row.scaled_num);

  // scale_y is applying a zoom to x and y
  // so the normal offset of -0.5 to get to the left side of the matrix now
  // needs to be scaled by scale_y
  var x_offset = -0.5 * (params.mat_size/0.5) * scale_y;

  // console.log('scale_y', scale_y)

  var mat_rotate = m3.rotation(Math.PI/2);

  // console.log(regl.prop('offset'))

  var args = {
    vert: `
      precision mediump float;
      attribute vec2 position;
      uniform mat4 zoom;
      uniform vec2 offset;
      uniform float x_offset;
      uniform float scale_y;
      uniform float scale_x;
      uniform mat3 mat_rotate;
      uniform float scale_offset;

      // vec3 tmp = vec3(1,1,1);

      // last value is a sort-of zoom
      void main () {
        // reverse y position to get words to be upright

        gl_Position = zoom *
                      vec4(
                            (position.x * scale_x) + x_offset,
                           -position.y + offset[1] * scale_y * scale_offset,
                           // depth
                           0.50,
                           // zoom
                           scale_y);
      }`,
    frag: `
      precision mediump float;
      void main () {
        gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
      }`,
    attributes: {
      position: regl.prop('positions')
    },
    elements: regl.prop('cells'),
    uniforms: {
      zoom: zoom_function,
      offset: regl.prop('offset'),
      x_offset: x_offset,
      scale_offset: params.mat_size/0.5,
      scale_y: scale_y,
      scale_x: scale_x,
      mat_rotate: mat_rotate
    },
    depth: {
      enable: true,
      mask: true,
      func: 'less',
      // func: 'greater',
      range: [0, 1]
    },
  };

  return args;

};