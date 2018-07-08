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

  // smaller scale_text -> larger text
  var tmp_reduce_text_factor = 4;
  var scale_text = params.text_zoom.row.scaled_num *
                   tmp_reduce_text_factor * 0.5 ;

  // scale_text is applying a zoom to x and y
  // so the normal offset of -0.5 to get to the left side of the matrix now
  // needs to be scaled by scale_text
  var mat_rotate = m3.rotation(Math.PI/2);

  // console.log(regl.prop('offset'))

  var args = {
    vert: `
      precision mediump float;
      attribute vec2 position;
      uniform mat4 zoom;
      uniform vec2 offset;
      uniform float x_offset;
      uniform float scale_text;
      uniform float y_total_zoom;
      uniform mat3 mat_rotate;
      uniform float scale_offset;
      varying float x_position;
      varying float y_position;
      varying float shift_text;

      // vec3 tmp = vec3(1,1,1);

      // last value is a sort-of zoom
      void main () {

        // reverse y position to get words to be upright

        shift_text = -1.0;

        // the x position is constant for all row labels

        // y_total_zoom stretches out row labels horizontally
        // then text is offset to the left side of the heatmap
        x_position = position.x * y_total_zoom +
                     x_offset * scale_text + shift_text;

        // the y position varies for all column labels
        y_position = -position.y + offset[1] * scale_text * scale_offset;

        gl_Position = zoom *
                      vec4(
                           x_position,
                           y_position,
                           // depth
                           0.50,
                           // zoom
                           scale_text);
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
      x_offset: -params.mat_size,
      scale_offset: params.mat_size/0.5,
      scale_text: scale_text,
      y_total_zoom: params.zoom_data.y.total_zoom,
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