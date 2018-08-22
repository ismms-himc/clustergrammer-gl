var blend_info = require('./blend_info');
var make_position_arr = require('./make_position_arr');
var make_opacity_arr = require('./make_opacity_arr');

module.exports = function make_matrix_args(regl, params){

  console.log('make_matrix_args')

  // make arrays
  params.arrs = {};
  params.arrs.opacity_arr = make_opacity_arr(params);

  params.arrs.position_arr = {};

  console.log('make ini position array')
  params.arrs.position_arr.ini = make_position_arr(params,
                                               params.inst_order.row,
                                               params.inst_order.col);

  console.log('make new position array')
  params.arrs.position_arr.new = make_position_arr(params,
                                               params.new_order.row,
                                               params.new_order.col);

  console.log('later in make_matrix_args')

  var opacity_buffer = regl.buffer({
    type: 'float',
    usage: 'dynamic'
  })(params.arrs.opacity_arr);

  var tile_width = params.tile_width;
  var tile_height = params.tile_height;

  var triangle_verts = [
    [tile_width, 0.0 ],
    [tile_width, tile_height],
    [0.0,       tile_height],
    [tile_width, 0.0],
    [0.0,       0.0],
    [0.0,       tile_height]
    ];

  var vert_string = `
    precision highp float;
    attribute vec2 position;
    attribute vec2 pos_att_ini, pos_att_new;
    attribute float opacity_att;
    uniform mat4 zoom;
    uniform bool run_animation;
    uniform float interp_uni;
    varying vec2 pos;

    // pass varying variables to fragment from vector
    varying float opacity_vary;

    void main() {

      // interpolate between the two positions using the interpolate uniform
      if (run_animation == true){
        pos = mix(pos_att_ini, pos_att_new, interp_uni);
      } else {
        pos = pos_att_ini;
      }

      gl_Position = zoom *
                    vec4( position.x + pos.x,
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

      if (opacity_vary > 0.0){
        gl_FragColor = vec4(1, 0, 0, abs(opacity_vary));
      } else {
        gl_FragColor = vec4(0, 0, 1, abs(opacity_vary));
      }

    }`;

  var num_instances = params.arrs.position_arr.ini.length;
  var zoom_function = params.zoom_function;

  var inst_properties = {
    vert: vert_string,
    frag: frag_string,
    attributes: {
      position: triangle_verts,
      pos_att_ini: {
        buffer: regl.buffer(params.arrs.position_arr.ini),
        divisor: 1
      },
      pos_att_new: {
        buffer: regl.buffer(params.arrs.position_arr.new),
        divisor: 1
      },
      opacity_att: {
        buffer: opacity_buffer,
        divisor: 1
        }
    },
    blend: {
        enable: true,
        func: {
          srcRGB: 'src alpha',
          srcAlpha: 1,
          dstRGB: 'one minus src alpha',
          dstAlpha: 1
        },
        equation: {
          rgb: 'add',
          alpha: 'add'
        },
        color: [0, 0, 0, 0]
      },
    count: 6,
    uniforms: {
      zoom: zoom_function,
      interp_uni: (ctx, props) => Math.max(0, Math.min(1, props.interp_prop)),
      run_animation: regl.prop('run_animation')
    },
    instances: num_instances,
    depth: {
      enable: false
    },
  };

  // draw top and bottom of matrix cells
  //////////////////////////////////////
  var matrix_args = {};
  matrix_args.regl_props = {};
  matrix_args.regl_props.rects = inst_properties;

  console.log('returning matrix_args')

  return matrix_args;

};