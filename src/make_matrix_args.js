var make_draw_cells_buffers = require('./make_draw_cells_buffers');
var blend_info = require('./blend_info');
var make_draw_cells_arr = require('./make_draw_cells_arr');

module.exports = function make_matrix_args(regl, params){

  console.log('make_matrix_args')

  // generate position and opacity arrays from params.mat_data
  params.arrs = make_draw_cells_arr(regl, params);

  // transfer to buffers is slow
  //////////////////////////////////////////
  var buffers_ini = make_draw_cells_buffers(regl, params.arrs.position_ini_arr,
                                        params.arrs.opacity_arr);

  var buffers_new = make_draw_cells_buffers(regl, params.arrs.position_new_arr,
                                        params.arrs.opacity_arr);

  var opacity_buffer = buffers_ini.opacity_buffer;
  var position_buffer_ini = buffers_ini.position_buffer;

  var position_buffer_new = buffers_new.position_buffer;

  /*
    Temporarily use latest mat_data dimensions (working on downsampling)
  */

  // var tile_width = params.tile_width;
  // var tile_height = params.tile_height;

  var tile_width = params.tile_width + params.animation.time_remain * 0.001;
  var tile_height = params.tile_height + params.animation.time_remain * 0.001;

  // bottom half
  var bottom_half_verts = [
    [tile_width, 0.0],
    [0.0,       0.0],
    [0.0,       tile_height]
  ];

  // top half
  var top_half_verts = [
    [tile_width, 0.0 ],
    [tile_width, tile_height],
    [0.0,       tile_height]
    ];

  var vert_string = `
    precision highp float;

    attribute vec2 position;

    // These three are instanced attributes.
    attribute vec2 pos_att_ini, pos_att_new;
    attribute float opacity_att;
    uniform mat4 zoom;
    uniform float ani_x;
    uniform float interp_uni;

    // pass varying variables to fragment from vector
    varying float opacity_vary;

    void main() {

      // Interpolate between the two positions using the interpolate uniform
      vec2 pos = mix(pos_att_ini, pos_att_new, interp_uni);

      gl_Position = zoom *
                    vec4( position.x + pos.x + ani_x,
                          position.y + pos.y,
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

  var num_instances = params.arrs.position_ini_arr.length;

  // var zoom_function = function(context){
  //   return context.view;
  // };

  var zoom_function = params.zoom_function;

  var ani_x = params.time;

  console.log(params.time % 3)

  var top_props = {
    vert: vert_string,
    frag: frag_string,
    attributes: {
      position: '',
      pos_att_ini: {
        buffer: position_buffer_ini,
        divisor: 1
      },
      pos_att_new: {
        buffer: position_buffer_new,
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
      interp_uni: (ctx, props) => Math.max(0, Math.min(1, props.interp_prop)),
      ani_x: regl.prop('ani_x')
      // ani_x: ani_x
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

  var bot_props = {
    vert: vert_string,
    frag: frag_string,
    attributes: {
      position: '',
      pos_att_ini : {
        buffer: position_buffer_ini,
        divisor: 1
      },
      pos_att_new: {
        buffer: position_buffer_new,
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
      interp_uni: (ctx, props) => Math.max(0, Math.min(1, props.interp_prop)),
      ani_x: regl.prop('ani_x')
      // ani_x: ani_x
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
  var matrix_args = {};
  matrix_args.regl_props = {};

  // var top_props = $.extend(true, {}, regl_props);
  // var top_props = JSON.parse(JSON.stringify(regl_props))
  top_props.attributes.position = top_half_verts;
  matrix_args.regl_props.top = top_props;

  // var bot_props = $.extend(true, {}, regl_props);
  // var bot_props = JSON.parse(JSON.stringify(regl_props))
  bot_props.attributes.position = bottom_half_verts;
  matrix_args.regl_props.bot = bot_props;

  return matrix_args;

};