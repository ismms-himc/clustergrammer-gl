var m3 = require('./mat3_transform');

module.exports = function make_col_text_triangle_args(regl, params, zoom_function){

  /* control allowable zoom for column text */

  var col_width = 1.00 *params.heat_size.x/params.num_col;


  params.text_scale.col = d3.scale.linear()
      .domain([1, 10])
      .range([1, 10/params.allowable_zoom_factor]);

  var total_zoom = params.zoom_data.x.total_zoom;

  /* Col Text */
  // update text information with zooming
  params.text_zoom.col.scaled_num = params.text_zoom.col.reference *
                                     params.text_scale.col(total_zoom);

  var mat_rotate =  m3.rotation(Math.PI/4);
  var text_y_scale = m3.scaling(1, total_zoom);

  // smaller number gives smaller text
  // rc_two_cats: 0.75
  // mnist: 1

  var scale_text = params.text_zoom.col.scaled_num;

  // need to shift col labels up to counteract the rotation by 45%
  var rh_tri_hyp = col_width;
  var rh_tri_side = rh_tri_hyp/Math.sqrt(2);

  var shift_text_out = 0.0;
  var shift_text_right = rh_tri_side; // col_width ;//- rh_tri_side;
  // make up for rotating text
  var shift_text_up = 0.0 // rh_tri_side;

  var args = {
    vert: `
      precision mediump float;
      attribute vec2 position;
      uniform mat4 zoom;
      uniform vec2 offset;
      uniform float y_offset;
      uniform float scale_text;
      uniform mat3 mat_rotate;
      uniform mat3 text_y_scale;
      uniform float total_zoom;
      uniform float col_width;
      varying vec3 rotated_text;
      varying vec3 position_cols;
      uniform float heat_size;
      varying vec3 xy_positions;
      varying float x_position;
      varying float y_position;
      uniform float shift_text_out;
      uniform float shift_text_right;
      uniform float shift_text_up;
      uniform float shift_heat;

      // last value is a sort-of zoom
      void main () {

        // rotate, reduce size, stretch in y, and give text triangles positions
        // shifting text up in the original text triangle units
        rotated_text = text_y_scale *
                       mat_rotate *
                       vec3(position.y - 0.5, position.x + shift_text_out, 0.5);

        // the y position is constant for all column labels
        //-----------------------------------------------

        // working on shifting text up
        // y_position = (y_offset + shift_text_up * total_zoom ) * scale_text ;
        y_position = y_offset * scale_text ;

        // the x position varies for all column labelss
        //-----------------------------------------------
        // x_position = (offset[1] + shift_text_right + shift_heat) 2.0 * * scale_text * heat_size;
        x_position = (offset[1] + shift_text_right ) * 2.0 * scale_text * heat_size + shift_heat * scale_text;

        position_cols = vec3( x_position, y_position, 0);

        xy_positions = rotated_text + position_cols;

        // reverse y position to get words to be upright
        ////////////////////////////
        // vec4: x, y, depth, zoom
        ////////////////////////////
        gl_Position = zoom * vec4( xy_positions, scale_text);

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
      scale_text: scale_text,
      shift_text_right: shift_text_right,
      shift_text_out: shift_text_out,
      shift_text_up: shift_text_up,

      // position columns at the top of the matrix, not the heatmap
      y_offset: params.mat_size.y,

      // shfit by the difference between the matrix size and hetamap size
      shift_heat: params.mat_size.x - params.heat_size.x,

      mat_rotate: mat_rotate,
      text_y_scale: text_y_scale,
      total_zoom: total_zoom,
      // need to pin down number
      col_width: col_width,
      heat_size: params.heat_size.x,
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