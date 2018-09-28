var m3 = require('./../draws/mat3_transform');
var color_to_rgba = require('./../colors/color_to_rgba');
var make_dendro_arr = require('./make_dendro_arr');

module.exports = function draw_mat_labels(regl, params, inst_axis){

  var rotation_radians;
  var heat_size;
  var mat_size_offset;
  if (inst_axis === 'row'){
    rotation_radians = 0;
    heat_size = params.viz_dim.heat_size.y;
    mat_size_offset = params.viz_dim.mat_size.x;
  } else if (inst_axis === 'col'){
    rotation_radians = Math.PI/2;
    heat_size = params.viz_dim.heat_size.x;
    mat_size_offset = params.viz_dim.mat_size.y;
  }

  var num_labels = params.labels['num_' + inst_axis];
  var dendro_width = 0.1;
  var tri_width = heat_size/num_labels;

  var dendro_arr = make_dendro_arr(params, inst_axis);

  var zoom_function = function(context){
    return context.view;
  };


  const dendro_buffer = regl.buffer({
    length: dendro_arr.length,
    type: 'float',
    usage: 'dynamic'
  });

  dendro_buffer(dendro_arr);

  var mat_scale = m3.scaling(1, 1);

  var mat_rotate = m3.rotation(rotation_radians);
  var inst_rgba = color_to_rgba('#eee', 1.0);

  var args = {

    vert: `
      precision highp float;
      attribute vec2 position;
      attribute vec2 dendro_att;

      uniform mat3 mat_rotate;
      uniform mat3 mat_scale;
      uniform mat4 zoom;
      uniform float mat_size_offset;

      varying vec3 new_position;
      varying vec3 vec_translate;

      void main () {

        // offset[1] will contain dendro width
        // new_position = vec3(position[0] * dendro_att[1], position[1], 0);
        new_position = vec3(position[0], position[1]  * dendro_att[1], 0);

        // offset[0] contains the actual offset
        vec_translate = vec3(mat_size_offset, dendro_att[0], 0);

        new_position = mat_rotate * ( mat_scale * new_position + vec_translate ) ;

        // depth is being set to 0.40
        gl_Position = zoom * vec4(new_position[0], new_position[1], 0.40, 1);

      }
    `,

    frag: `

      precision highp float;
      uniform vec4 triangle_color;

      // color triangle red
      void main () {
        gl_FragColor = triangle_color;
      }

    `,

    attributes: {
      position: [
        [      0.0, 2*tri_width],
        [dendro_width, tri_width],
        [      0.0, 0],
      ],
      dendro_att: {
        buffer: dendro_buffer,
        divisor: 1
      }
    },

    uniforms: {
      zoom: zoom_function,
      mat_rotate: mat_rotate,
      mat_scale: mat_scale,
      mat_size_offset: mat_size_offset,
      triangle_color: inst_rgba
    },

    count: 3,
    instances: dendro_arr.length,
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