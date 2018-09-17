var m3 = require('./../draws/mat3_transform');
var interp_fun = require('./../draws/interp_fun');

module.exports = function make_col_text_args(regl, params, zoom_function){

  var col_width = params.heat_size.x/params.num_col;

  params.text_scale.col = d3.scale.linear()
      .domain([1, 10])
      .range([1, 10/params.allowable_zoom_factor.col]);

  // 17.5, lowering makes larger text
  var final_increase_font_size = params.num_col/5.0;
  params.text_scale.col = d3.scale.linear()
      .domain([1, params.max_zoom])
      .range( [1, final_increase_font_size]);

  var scale_text = params.num_col ;

  var webgl_fs = (1/params.num_col) * params.zoom_data.x.total_zoom;

  var max_webgl_fs = params.text_zoom.col.max_webgl_fs;

  var scale_down_fs;
  if (webgl_fs > max_webgl_fs){
    scale_down_fs = webgl_fs/max_webgl_fs;
    scale_text = scale_text * scale_down_fs;
  }

  var mat_rotate =  m3.rotation(Math.PI/4);
  var text_y_scale = m3.scaling(1, params.zoom_data.x.total_zoom);

  // need to shift col labels up to counteract the rotation by 45%
  var rh_tri_hyp = col_width;
  var rh_tri_side = rh_tri_hyp/Math.sqrt(2);

  var shift_text_out = 0.0;
  var shift_text_right = col_width;
  // make up for rotating text
  var shift_text_up = -0.5 * rh_tri_side;

  var vert_arg = `
      precision mediump float;
      attribute vec2 position;
      uniform mat4 zoom;
      uniform vec2 inst_offset;
      uniform vec2 new_offset;
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
      uniform float interp_uni;
      uniform bool run_animation;
      varying vec2 mixed_offset;

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
        // interpolate between the two positions using the interpolate uniform
        if (run_animation){
          mixed_offset = mix(inst_offset, new_offset , interp_uni);
        } else {
          mixed_offset = inst_offset;
        }

        // mixed_offset = inst_offset;

        x_position = (mixed_offset[1] * 2.0 * heat_size + shift_heat + shift_text_right);

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
      inst_offset: regl.prop('inst_offset'),
      new_offset: regl.prop('new_offset'),
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
      // alternate way to define interpolate uni
      interp_uni: () => Math.max(0, Math.min(1, interp_fun(params))),
      run_animation: params.animation.running
    },
    depth: {
      enable: true,
      mask: true,
      func: 'less',
      range: [0, 1]
    },
  };

  return args;

};