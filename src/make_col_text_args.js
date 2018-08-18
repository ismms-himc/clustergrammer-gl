var m3 = require('./mat3_transform');

module.exports = function make_col_text_args(regl, params, zoom_function){

  var col_width = params.heat_size.x/params.num_col;

  params.text_scale.col = d3.scale.linear()
      .domain([1, 10])
      .range([1, 10/params.allowable_zoom_factor.col]);

  // /* Col Text */
  // // update text information with zooming
  // // var limited_scaling = params.text_scale.col(total_zoom);
  // params.text_zoom.col.scaled_num = params.text_zoom.col.reference *
  //                                    params.text_scale.col(params.zoom_data.x.total_zoom);

  // 17.5, lowering makes larger text
  var final_increase_font_size = params.num_col/5.0;
  params.text_scale.col = d3.scale.linear()
      .domain([1, params.max_zoom])
      .range( [1, final_increase_font_size]);
  var inst_increase_font_size = params.text_scale.col(params.zoom_data.x.total_zoom);
  var scale_text = params.text_zoom.col.scaled_num * params.zoom_data.x.total_zoom / inst_increase_font_size;

  var mat_rotate =  m3.rotation(Math.PI/4);
  var text_y_scale = m3.scaling(1, params.zoom_data.x.total_zoom);

  // need to shift col labels up to counteract the rotation by 45%
  var rh_tri_hyp = col_width;
  var rh_tri_side = rh_tri_hyp/Math.sqrt(2);

  var shift_text_out = 0.0;
  var shift_text_right = col_width; // rh_tri_side; // col_width ;//- rh_tri_side;
  // make up for rotating text
  var shift_text_up = - 0.5 * rh_tri_side;

  var vert_arg = `
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
                       vec3(position.y/scale_text, position.x/scale_text, 0.0);

        // the y position is constant for all column labels
        //---------------------------------------------------------------
        // working on shifting text up
        //---------------------------------------------------------------
        y_position = y_offset;

        // the x position varies for all column labelss
        //---------------------------------------------------------------
        //---------------------------------------------------------------
        x_position = (offset[1] * 2.0 * heat_size + shift_heat + shift_text_right);

        position_cols = vec3( x_position, y_position, 0.10);

        xy_positions = rotated_text + position_cols;

        // reverse y position to get words to be upright
        ////////////////////////////
        // vec4: x, y, depth, zoom
        ////////////////////////////
        gl_Position = zoom * vec4( xy_positions, 1.0);

      }`;

  var frag_arg = `
      precision mediump float;
      void main () {
        gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
      }`;

  var args = {
    vert: vert_arg,
    frag: frag_arg,
    attributes: {
      position: regl.prop('positions')
    },
    elements: regl.prop('cells'),
    uniforms: {
      zoom: zoom_function,
      offset: regl.prop('offset'),
      scale_text: scale_text,
      y_offset: params.mat_size.y,
      heat_size: params.heat_size.x,
      shift_heat: params.mat_size.x - params.heat_size.x,
      shift_text_right: shift_text_right,
      shift_text_out: shift_text_out,
      shift_text_up: shift_text_up,
      mat_rotate: mat_rotate,
      text_y_scale: text_y_scale,
      total_zoom: params.zoom_data.x.total_zoom,
      col_width: col_width,
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