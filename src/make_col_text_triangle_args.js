var m3 = require('./mat3_transform');

module.exports = function make_col_text_triangle_args(regl, params, zoom_function){

  /* control allowable zoom for column text */

  params.text_scale.col = d3.scale.linear()
      .domain([1, 10])
      .range([1, 10/params.allowable_zoom_factor]);

  /* Col Text */
  // update text information with zooming
  params.text_zoom.col.scaled_num = params.text_zoom.col.reference *
                                     params.text_scale.col(params.zoom_data.x.total_zoom);

  /*
  works but needs to be improved
  */

  // manually tuned numbers
  var col_y_offset = d3.scale.linear()
    .domain([50, 100])
    .range([25.9, 52]);

  // console.log(params.text_zoom.col.scaled_num);
  var y_offset = col_y_offset(params.text_zoom.col.scaled_num);
  // console.log('y_offset', y_offset)

  //---------------------------------
  // Working on cleaning column positioning
  // smaller scale_text -> larger text

  var tmp_reduce_text_factor = 1.5;
  var scale_text = params.text_zoom.row.scaled_num *
                   tmp_reduce_text_factor;

  // var shift_text = -1.0;
  // var y_offset = params.mat_size * scale_text + shift_text;
  // console.log('tmp', tmp)

  //---------------------------------

  /*
  Not using mat_translate since each label needs to be translated a specific
  amount that is saved in the batch data.
  */

  // var mat_rotate =  m3.rotation(Math.PI/4);
  var mat_rotate =  m3.rotation(0);

  var text_y_scale = m3.scaling(1, params.zoom_data.x.total_zoom);

  // smaller number gives smaller text
  // rc_two_cats: 0.75
  // mnist: 1
  var reduce_factor = 0.75; // 1 / params.zoom_data.x.total_zoom;
  var total_zoom = params.zoom_data.x.total_zoom;

  // var mat_reduce_text_size = m3.scaling(reduce_factor, reduce_factor);
  var mat_reduce_text_size = m3.scaling(1, 1);

  var scale_text = params.text_zoom.col.scaled_num;

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
      uniform mat3 mat_reduce_text_size;
      uniform float total_zoom;
      uniform float col_width;
      varying vec3 rotated_text;
      varying vec3 shift_to_right;
      varying vec3 position_cols;
      uniform float scale_offset;
      varying vec3 xy_positions;
      varying float col_x;
      varying float col_y;
      varying float shift_text;

      // last value is a sort-of zoom
      void main () {

        // rotate, reduce size, stretch in y, and give text triangles positions
        rotated_text = text_y_scale *
                       mat_rotate *
                       mat_reduce_text_size *
                       vec3(position.y, position.x, 0.5);

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

        // shift_to_right = vec3( col_width * total_zoom , 0, 0);
        shift_to_right = vec3(0 , 0, 0);

        shift_text = 0.0;

        // the x position varies for all column labelss
        //-----------------------------------------------
        col_x = offset[1] * scale_text * scale_offset;

        // the y position is constant for all column labels
        //-----------------------------------------------
        // col_y = 0.0; // y_offset; //  * scale_offset;
        col_y = y_offset * scale_text + shift_text;

        position_cols = vec3( col_x, col_y, 0);


        xy_positions = rotated_text + shift_to_right + position_cols;

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

      // y_offset: y_offset,
      y_offset: params.mat_size,

      width_scale: params.zoom_data.x.total_zoom,
      mat_rotate: mat_rotate,
      text_y_scale: text_y_scale,
      mat_reduce_text_size: mat_reduce_text_size,
      total_zoom: total_zoom,
      // need to pin down number
      col_width: params.mat_size/params.num_col,
      scale_offset: params.mat_size/0.5,
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