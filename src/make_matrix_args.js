var make_draw_cells_buffers = require('./make_draw_cells_buffers');
var blend_info = require('./blend_info');
var $ = require('jquery');
var make_draw_cells_arr = require('./make_draw_cells_arr');

module.exports = function make_matrix_args(regl, params){

  // generate position and opacity arrays from params.mat_data
  params.arrs = make_draw_cells_arr(regl, params);

  // transfer to buffers is slow
  //////////////////////////////////////////
  var buffers = make_draw_cells_buffers(regl, params.arrs.position_arr,
                                        params.arrs.opacity_arr);

  var opacity_buffer = buffers.opacity_buffer;
  var position_buffer = buffers.position_buffer;

  // var num_row = params.num_row;
  // var num_col = params.num_col;

  /*
    Temporarily use latest mat_data dimensions (working on downsampling)
  */
  var num_row = params.mat_data.length;
  var num_col = params.mat_data[0].length;

  var cell_width = (params.mat_size/0.5)/num_col;
  var cell_height = (params.mat_size/0.5)/num_row;

  // bottom half
  var bottom_half_verts = [
    [cell_width, 0.0],
    [0.0,       0.0],
    [0.0,       cell_height]
  ];

  // top half
  var top_half_verts = [
    [cell_width, 0.0 ],
    [cell_width, cell_height],
    [0.0,       cell_height]
    ];

  var vert_string = `
    precision highp float;

    attribute vec2 position;

    // These three are instanced attributes.
    attribute vec2 pos_att;
    attribute float opacity_att;
    uniform mat4 zoom;

    // pass varying variables to fragment from vector
    varying float opacity_vary;

    void main() {

      gl_Position = zoom *
                    vec4( position.x + pos_att.x,
                          position.y + pos_att.y,
                          // positioned further down (spillover recst are
                          // above at 0.5)
                          0.75,
                          1
                        );

      // pass attribute (in vert) to varying in frag
      opacity_vary = opacity_att;

    }`;

  var frag_string = `
    precision highp float;

    // use the varying being passed from the vertex shader
    varying float opacity_vary;

    void main() {

      // manually tweaking opacity range, will improve to match old version

      if (opacity_vary > 0.0){
        gl_FragColor = vec4(1, 0, 0, abs(opacity_vary) + 0.15);
      } else {
        gl_FragColor = vec4(0, 0, 1, abs(opacity_vary) + 0.15);
      }

    }`;

  var num_instances = params.arrs.position_arr.length;

  // var zoom_function = function(context){
  //   return context.view;
  // };

  var zoom_function = params.zoom_function;

  var regl_props = {
    vert: vert_string,
    frag: frag_string,
    attributes: {
      position: '',
      pos_att: {
        buffer: position_buffer,
        divisor: 1
      },
      opacity_att: {
        buffer: opacity_buffer,
        divisor: 1
        }
    },
    blend: blend_info,
    count: 3,
    uniforms: {
      zoom: zoom_function,
    },
    instances: num_instances,
    depth: {
      enable: true,
      mask: true,
      func: 'less',
      // func: 'greater',
      range: [0, 1]
    },
  };

  // draw top and bottom of matrix cells
  //////////////////////////////////////
  var draw_cells_props = {};
  draw_cells_props.regl_props = {};

  var top_props = $.extend(true, {}, regl_props);
  top_props.attributes.position = top_half_verts;
  draw_cells_props.regl_props.top = top_props;

  var bot_props = $.extend(true, {}, regl_props);
  bot_props.attributes.position = bottom_half_verts;
  draw_cells_props.regl_props.bot = bot_props;

  return draw_cells_props;

};