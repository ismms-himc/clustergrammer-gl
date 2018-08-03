var make_draw_cells_buffers = require('./make_draw_cells_buffers');
var blend_info = require('./blend_info');
var make_draw_cells_arr = require('./make_draw_cells_arr');

module.exports = function make_matrix_args(regl, params, tmp=0){

  console.log('make_matrix_args')

  // generate position and opacity arrays from params.mat_data
  params.arrs = make_draw_cells_arr(regl, params);

  // transfer to buffers is slow
  //////////////////////////////////////////
  var buffers = make_draw_cells_buffers(regl, params.arrs.position_arr,
                                        params.arrs.opacity_arr);

  var opacity_buffer = buffers.opacity_buffer;
  var position_buffer = buffers.position_buffer;

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
    attribute vec2 pos_att;
    attribute float opacity_att;
    uniform mat4 zoom;

    // pass varying variables to fragment from vector
    varying float opacity_vary;

    void main() {

      gl_Position = zoom *
                    vec4( position.x + pos_att.x,
                          position.y + pos_att.y,
                          // positioned further down (spillover rects are
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

  var top_props = {
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

  var bot_props = {
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

  // var top_props = $.extend(true, {}, regl_props);
  // var top_props = JSON.parse(JSON.stringify(regl_props))
  top_props.attributes.position = top_half_verts;
  draw_cells_props.regl_props.top = top_props;

  // var bot_props = $.extend(true, {}, regl_props);
  // var bot_props = JSON.parse(JSON.stringify(regl_props))
  bot_props.attributes.position = bottom_half_verts;
  draw_cells_props.regl_props.bot = bot_props;

  return draw_cells_props;

};