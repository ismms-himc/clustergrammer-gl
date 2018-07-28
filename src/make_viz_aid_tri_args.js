var m3 = require('./mat3_transform');
var color_to_rgba = require('./color_to_rgba');
// var color_table = require('./color_table.js');

module.exports = function make_viz_aid_tri_args(regl, params, inst_rc){


  // var inst_rgba = color_to_rgba('#eee', 1.0);
  var inst_rgba = color_to_rgba('red', 1.0);

  var num_labels = params['num_'+inst_rc];

  var tri_height;
  var tri_width;
  var mat_size;
  var top_shift_triangles;
  var top_offset;
  if (inst_rc === 'col'){

    mat_size = params.heat_size.x;

    // keep positioned at matrix not heatmap (make room for categories)
    // making triangle smaller
    var reduce_height = params.zoom_data.x.total_zoom/params.zoom_data.y.total_zoom;

    tri_height = mat_size/num_labels * reduce_height;
    tri_width  = mat_size/num_labels;
    top_offset = -params.mat_size.y - 2 * tri_height;

  } else {

    // rows have fixed viz aid triangle 'heights'
    mat_size = params.heat_size.y;
    tri_height = 0.025/2;
    tri_width = mat_size/num_labels;
    top_offset = -params.mat_size.x - 2 * tri_height;

  }

  var zoom_function = function(context){
    return context.view;
  };

  var inst_order = 'clust';
  var y_offset_array = [];
  var i;
  for (i = 0; i < num_labels; i++){

    // emperically found rules
    var order_id;
    var shift_mat_heat;
    if (inst_rc == 'row'){
      order_id = num_labels - params.network[inst_rc + '_nodes'][i][inst_order] - 1;
      shift_mat_heat = - (params.mat_size.y - params.heat_size.y)
    } else {
      order_id = params.network[inst_rc + '_nodes'][i][inst_order] ;
      shift_mat_heat = params.mat_size.x - params.heat_size.x
    }

    /* need to position based on clustering order */
    // the last part is necessary to shfit the viz aid triangles down to make up for the smaller size
    // of the heatmap vs the general matrix area

    y_offset_array[i] = mat_size - tri_width - order_id * 2 * tri_width + shift_mat_heat;
  }

  const y_offset_buffer = regl.buffer({
    length: num_labels,
    type: 'float',
    usage: 'dynamic'
  });

  y_offset_buffer(y_offset_array);

  /////////////////////////////////
  // Rotation and Scaling
  /////////////////////////////////

  var scale_y = m3.scaling(2, 1);

  var rotation_radians;
  if (inst_rc === 'row'){
    rotation_radians = 0;
  } else if (inst_rc === 'col'){
    rotation_radians = Math.PI/2;
  }

  var mat_rotate = m3.rotation(rotation_radians);

  var total_zoom = params.zoom_data.x.total_zoom;

  var args = {

    vert: `
      precision highp float;
      attribute vec2 ini_position;
      attribute float y_offset_att;

      uniform mat3 mat_rotate;
      uniform mat3 scale_y;
      uniform mat4 zoom;
      uniform float top_offset;
      uniform float total_zoom;

      varying vec3 new_position;
      varying vec3 vec_translate;

      // // pass varying variable to fragment from vector
      // varying vec4 color_vary;

      void main () {

        new_position = vec3(ini_position, 0);

        vec_translate = vec3(top_offset, y_offset_att, 0);

        // rotate translated triangles
        new_position = mat_rotate * ( new_position + vec_translate ) ;

        // depth is being set to 0.45
        gl_Position = zoom * vec4( vec2(new_position), 0.45, 1);


      }
    `,

    frag: `

      precision mediump float;
      uniform vec4 triangle_color;

      // color triangle red
      void main () {

        // defining the triangle color using a uniform
        gl_FragColor = triangle_color;

      }

    `,

    // passing a fixed value for the triangle position
    attributes: {
      ini_position: [
        [2 * tri_height,    tri_width],
        [    tri_height,  0.0],
        [2 * tri_height,   -tri_width],
      ],

      // pass y_offset_att buffer
      y_offset_att: {
        buffer: y_offset_buffer,
        divisor: 1
      },

    },

    uniforms: {
      zoom: zoom_function,
      mat_rotate: mat_rotate,
      scale_y: scale_y,
      top_offset: top_offset,
      triangle_color: inst_rgba,
      total_zoom: total_zoom
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