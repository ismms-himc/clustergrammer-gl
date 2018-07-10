var m3 = require('./mat3_transform');

module.exports = function make_col_text_triangle_args(regl, params, zoom_function){

  /* control allowable zoom for column text */

  var col_width = params.mat_size/params.num_col;

  // need to shift col labels up to counteract the rotation by 45%
  var rh_tri_hyp = col_width/2;
  var rh_tri_side = rh_tri_hyp/Math.sqrt(2);

  params.text_scale.col = d3.scale.linear()
      .domain([1, 10])
      .range([1, 10/params.allowable_zoom_factor]);

  /* Col Text */
  // update text information with zooming
  params.text_zoom.col.scaled_num = params.text_zoom.col.reference *
                                     params.text_scale.col(params.zoom_data.x.total_zoom);

  //---------------------------------
  // Working on cleaning column positioning
  // smaller scale_text -> larger text

  // var tmp_reduce_text_factor = 1.5;
  // var scale_text = params.text_zoom.row.scaled_num *
  //                  tmp_reduce_text_factor;

  //---------------------------------

  /*
  Not using mat_translate since each label needs to be translated a specific
  amount that is saved in the batch data.
  */

  var mat_rotate =  m3.rotation(Math.PI/4);
  // var mat_rotate =  m3.rotation(0);

  var text_y_scale = m3.scaling(1, params.zoom_data.x.total_zoom);

  // smaller number gives smaller text
  // rc_two_cats: 0.75
  // mnist: 1
  var total_zoom = params.zoom_data.x.total_zoom;

  var scale_text = params.text_zoom.col.scaled_num;

  // var shift_text_right = 0.3/params.num_col;
  var shift_text_out = 0.1;
  var shift_text_right = col_width - rh_tri_side;
  // make up for rotating text
  var shift_text_up = rh_tri_side * 1.5;

  var scale_offset = params.mat_size/0.5;

  var args = {
    vert: `
      precision mediump float;
      attribute vec2 position;
      uniform mat4 zoom;
      uniform vec2 offset;
      uniform float y_offset;
      uniform float scale_text;
      uniform float width_scale;
      uniform mat3 mat_rotate;
      uniform mat3 text_y_scale;
      uniform float total_zoom;
      uniform float col_width;
      varying vec3 rotated_text;
      varying vec3 position_cols;
      uniform float scale_offset;
      varying vec3 xy_positions;
      varying float col_x;
      varying float col_y;
      uniform float shift_text_out;
      uniform float shift_text_right;
      uniform float shift_text_up;

      // last value is a sort-of zoom
      void main () {

        // rotate, reduce size, stretch in y, and give text triangles positions
        rotated_text = text_y_scale *
                       mat_rotate *
                       vec3(position.y , position.x + shift_text_out, 0.5);

        /*
          Shift text over a little by a fixed amount and then
          shift by a zoom-dependent amount so that the bottom
          of the text remains at the same lower right position
          vec3( 0.11 * total_zoom  + 0.2 , 0, 0)

          need to have
            0.11 * total_zoom
          factor scale with the number of columns
          so that the labels remain on top of the correct columns
        */


        // the x position varies for all column labelss
        //-----------------------------------------------
        // col_x = (offset[1] + shift_text_right ) * scale_text * scale_offset;
        col_x = (offset[1] + col_width/2.0) * scale_text * scale_offset;

        // the y position is constant for all column labels
        //-----------------------------------------------
        col_y = (y_offset + shift_text_up) * scale_text;

        position_cols = vec3( col_x, col_y, 0);

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

      y_offset: params.mat_size,

      width_scale: params.zoom_data.x.total_zoom,
      mat_rotate: mat_rotate,
      text_y_scale: text_y_scale,
      total_zoom: total_zoom,
      // need to pin down number
      col_width: col_width,
      scale_offset: scale_offset,
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