var m3 = require('./mat3_transform');
var color_to_rgba = require('./color_to_rgba');
var color_table = require('./color_table.js');

module.exports = function make_viz_aid_tri_args(regl, params, inst_rc){

  /*

  Hacking Categories Plan
  ------------------------
  Make a buffer of vec4's that will pass rgba data for the different category
  colors. Then pass this as an attribute (or varying?) to the fragment shader.

  */

  // var inst_rgba = color_to_rgba('#ff0000', 0.5);
  var inst_rgba = color_to_rgba('purple', 0.95);

  var color_names = _.keys(color_table);

  var num_labels = params['num_'+inst_rc];

  var row_width = 0.025;
  var row_height = (params.mat_size/0.5) * 1/num_labels;

  var zoom_function = function(context){
    return context.view;
  };

  /////////////////////////////////
  // Label Offset Buffer
  /////////////////////////////////

  var x_offset = -(0.5)*(params.mat_size/0.5) - row_width;

  var inst_order = 'clust';

  var y_offset_array = [];
  var i;
  for (i = 0; i < num_labels; i++){

    // emperically found rules
    var order_id;
    if (inst_rc == 'row'){
      order_id = num_labels - params.network[inst_rc + '_nodes'][i][inst_order] - 1;
    } else {
      order_id = params.network[inst_rc + '_nodes'][i][inst_order] ;
    }

    /* need to position based on clustering order */
    y_offset_array[i] = (params.mat_size/0.5) * 0.5 - row_height/2 - order_id * row_height;
  }

  const y_offset_buffer = regl.buffer({
    length: num_labels,
    type: 'float',
    usage: 'dynamic'
  });

  y_offset_buffer(y_offset_array);


  /////////////////////////////////
  // Label Color Buffer
  /////////////////////////////////

  var color_arr = [];
  for (i = 0; i < num_labels; i++){


    var inst_cat = params.network[inst_rc + '_nodes'][i]['cat-0'];
    // console.log(inst_cat)

    /*
      Added fallback color
    */
    var inst_color;
    if ('cat_colors' in params.network){

      if ('cat-0' in params.network.cat_colors[inst_rc]){
        try {
          inst_color = params.network.cat_colors[inst_rc]['cat-0'][inst_cat];
        }
        catch(err){
          // get random colors from color dictionary
          inst_color = 'white';
        }
      } else {
        // get random colors from color dictionary
        inst_color = 'white';
      }

    } else {

      // get random colors from color dictionary
      inst_color = 'white';
    }

    color_arr[i] = color_to_rgba(inst_color, 1);
  }

  const color_buffer = regl.buffer({
    length: num_labels,
    // 'type': 'vec4',
    'usage': 'dynamic'
  })

  color_buffer(color_arr);

  params.color_arr = color_arr;

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

  var args = {

    vert: `
      precision highp float;
      attribute vec2 ini_position;
      attribute float y_offset_att;
      attribute vec4 color_att;

      uniform mat3 mat_rotate;
      uniform mat3 scale_y;
      uniform mat4 zoom;
      uniform float x_offset_uni;

      varying vec3 new_position;
      varying vec3 vec_translate;

      // pass varying variable to fragment from vector
      varying vec4 color_vary;

      void main () {

        new_position = vec3(ini_position, 0);

        vec_translate = vec3(x_offset_uni, y_offset_att, 0);

        // rotate translated triangles
        new_position = mat_rotate * ( new_position + vec_translate ) ;

        /*
          need to stretch column viz_aid_triangles in y direction
        */

        // depth is being set to 0.45
        gl_Position = zoom * vec4( vec2(new_position), 0.45, 1);

        // pass attribute (in vert) to varying in frag
        color_vary = color_att;

      }
    `,

    frag: `

      precision mediump float;
      uniform vec4 triangle_color;

      // use the varying being passed from the vertex shader
      varying vec4 color_vary;

      // color triangle red
      void main () {
        // gl_FragColor = vec4(0.6, 0.6, 0.6, opacity_vary);

        // defining the triangle color using a uniform
        // gl_FragColor = triangle_color;

        // define the triangle color using a varying
        gl_FragColor = color_vary;
      }

    `,

    // passing a fixed value for the triangle position
    attributes: {
      ini_position: [
        [row_width,  row_height/2],
        [row_width/2,  0.0],
        [row_width, -row_height/2],
      ],

      // pass y_offset_att buffer
      y_offset_att: {
        buffer: y_offset_buffer,
        divisor: 1
      },

      // pass color buffer
      color_att: {
        buffer: color_buffer,
        divisor: 1
      },

    },

    uniforms: {
      zoom: zoom_function,
      mat_rotate: mat_rotate,
      scale_y: scale_y,
      x_offset_uni: x_offset,
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