var m3 = require('./../draws/mat3_transform');
var color_to_rgba = require('./../colors/color_to_rgba');

module.exports = function draw_mat_labels(regl, params, inst_axis){

  var inst_rgba = color_to_rgba('#eee', 1.0);
  var rotation_radians;
  var mat_size;
  var mat_size_offset;
  var shift_heat;
  if (inst_axis === 'row'){
    rotation_radians = 0;
    mat_size = params.viz_dim.heat_size.y;
    mat_size_offset = params.viz_dim.mat_size.x;
    shift_heat = params.viz_dim.mat_size.y - params.viz_dim.heat_size.y;
  } else if (inst_axis === 'col'){
    rotation_radians = Math.PI/2;
    mat_size = params.viz_dim.heat_size.x;
    mat_size_offset = params.viz_dim.mat_size.y;
    shift_heat = -(params.viz_dim.mat_size.x - params.viz_dim.heat_size.x);
  }

  var num_labels = params.labels['num_' + inst_axis];

  var row_width = 0.025;
  var tri_width = mat_size/num_labels;

  var zoom_function = function(context){
    return context.view;
  };

  /////////////////////////////////
  // make buffer for row offsets
  /////////////////////////////////

  var x_offset = 0.5 * (mat_size_offset/0.5);

  var y_offset_array = [];
  for (var inst_index=0; inst_index < num_labels; inst_index++){
    y_offset_array[inst_index] = mat_size - tri_width - shift_heat - 2 * tri_width * inst_index;
  }

  const y_offset_buffer = regl.buffer({
    length: num_labels,
    type: 'float',
    usage: 'dynamic'
  });

  y_offset_buffer(y_offset_array);

  var mat_scale = m3.scaling(1, 1);

  var mat_rotate = m3.rotation(rotation_radians);

  var args = {

    vert: `
      precision highp float;
      attribute vec2 position;
      attribute float y_offset_att;

      uniform mat3 mat_rotate;
      uniform mat3 mat_scale;
      uniform mat4 zoom;
      uniform float x_offset;

      varying vec3 new_position;
      varying vec3 vec_translate;

      void main () {

        new_position = vec3(position, 0);

        vec_translate = vec3(x_offset, y_offset_att, 0);

        // new_position = mat_rotate * mat_scale * new_position + vec_translate;
        new_position = mat_rotate * ( mat_scale * new_position + vec_translate ) ;

        // depth is being set to 0.45
        gl_Position = zoom * vec4(new_position[0], new_position[1], 0.40, 1);

      }
    `,

    frag: `

      precision highp float;
      uniform vec4 triangle_color;

      // color triangle red
      void main () {
        // gl_FragColor = vec4(0.0, 1, 0.0, 1);
        gl_FragColor = triangle_color;
      }

    `,

    attributes: {
      position: [
        [0.0,  2 * tri_width/2],
        [row_width/2,  0.0],
        [0.0, -2 * tri_width/2],
      ],
      y_offset_att: {
        buffer: y_offset_buffer,
        divisor: 1
      }
    },

    uniforms: {
      zoom: zoom_function,
      mat_rotate: mat_rotate,
      mat_scale: mat_scale,
      x_offset: x_offset,
      triangle_color: inst_rgba
    },

    count: 3,
    instances: num_labels,
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