var m3 = require('./../draws/mat3_transform');

module.exports = function draw_mat_labels(regl, params, inst_rc){

  var rotation_radians;
  var mat_size;
  var mat_size_offset;
  var y_shift;
  if (inst_rc === 'row'){
    rotation_radians = 0;
    mat_size = params.heat_size.y;
    mat_size_offset = params.mat_size.x;
    y_shift = -(params.mat_size.y - params.heat_size.y);
  } else if (inst_rc === 'col'){
    rotation_radians = Math.PI/2;
    mat_size = params.heat_size.x;
    mat_size_offset = params.mat_size.y;
    y_shift = params.mat_size.x - params.heat_size.x;
  }

  var num_labels = params['num_' + inst_rc];

  var row_width = 0.025;
  var tile_height = (1/num_labels) * (mat_size/0.5);

  var zoom_function = function(context){
    return context.view;
  };

  /////////////////////////////////
  // make buffer for row offsets
  /////////////////////////////////

  var x_offset = 0.5 * (mat_size_offset/0.5) ; // row_width;

  var y_offset_array = [];
  for (var i = 0; i < num_labels; i++){
    y_offset_array[i] = mat_size - tile_height/2 - i * tile_height;
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
      uniform float y_shift;

      varying vec3 new_position;
      varying vec3 vec_translate;

      void main () {

        new_position = vec3(position, 0);

        vec_translate = vec3(x_offset, y_offset_att + y_shift, 0);

        // new_position = mat_rotate * mat_scale * new_position + vec_translate;
        new_position = mat_rotate * ( mat_scale * new_position + vec_translate ) ;

        // depth is being set to 0.45
        gl_Position = zoom * vec4(new_position[0], new_position[1], 0.40, 1);

      }
    `,

    frag: `

      // color triangle red
      void main () {
        gl_FragColor = vec4(0.0, 1, 0.0, 1);
      }

    `,

    attributes: {
      position: [
        [0.0,  tile_height/2],
        [row_width/2,  0.0],
        [0.0, -tile_height/2],
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
      y_shift: y_shift,
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