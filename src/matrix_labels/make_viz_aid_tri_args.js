var m3 = require('./../draws/mat3_transform');
var color_to_rgba = require('./../colors/color_to_rgba');
var make_viz_aid_tri_pos_arr = require('./make_viz_aid_tri_pos_arr');
var interp_fun = require('./../draws/interp_fun');

module.exports = function make_viz_aid_tri_args(regl, params, inst_axis){

  var inst_rgba = color_to_rgba('#eee', 1.0);
  // var inst_rgba = color_to_rgba('red', 1.0);
  var num_labels = params['num_' + inst_axis];

  var tri_height;
  var tri_width;
  var mat_size;
  var top_offset;

  if (inst_axis === 'col'){

    mat_size = params.heat_size.x;
    // keep positioned at matrix not heatmap (make room for categories)
    // making triangle smaller
    var reduce_height = params.zoom_data.x.total_zoom;
    tri_height = mat_size/num_labels * reduce_height;
    tri_width  = mat_size/num_labels;

    // original top_offset calc (undercorrects)
    top_offset = -params.viz_dim.mat_size.y - tri_height;

  } else {

    // rows have fixed viz aid triangle 'heights'
    mat_size = params.heat_size.y;
    tri_height = 0.0125;
    tri_width = mat_size/num_labels;
    top_offset = -params.viz_dim.mat_size.x - tri_height;

  }

  var zoom_function = function(context){
    return context.view;
  };

  var tri_offset_array_inst = make_viz_aid_tri_pos_arr(params, inst_axis, params.inst_order[inst_axis]);
  var tri_offset_array_new = make_viz_aid_tri_pos_arr(params, inst_axis, params.new_order[inst_axis]);

  /////////////////////////////////
  // Rotation and Scaling
  /////////////////////////////////

  var scale_y = m3.scaling(2, 1);

  var rotation_radians;
  if (inst_axis === 'row'){
    rotation_radians = 0;
  } else if (inst_axis === 'col'){
    rotation_radians = Math.PI/2;
  }

  var mat_rotate = m3.rotation(rotation_radians);

  var total_zoom = params.zoom_data.x.total_zoom;

  var args = {

    vert: `
      precision highp float;
      attribute vec2 ini_position;
      attribute float tri_offset_att_inst;
      attribute float tri_offset_att_new;

      uniform mat3 mat_rotate;
      uniform mat3 scale_y;
      uniform mat4 zoom;
      uniform float top_offset;
      uniform float total_zoom;
      uniform float interp_uni;
      uniform bool run_animation;

      varying vec3 new_position;
      varying vec3 vec_translate;
      varying vec2 viz_aid_pos;

      void main () {

        new_position = vec3(ini_position, 0);

        // interpolate between the two positions using the interpolate uniform
        if (run_animation){
          viz_aid_pos = mix(vec2(tri_offset_att_inst, 0), vec2(tri_offset_att_new, 0), interp_uni);
        } else{
          viz_aid_pos = vec2(tri_offset_att_inst, 0);
        }

        vec_translate = vec3(top_offset, viz_aid_pos);

        // rotate translated triangles
        new_position = mat_rotate * ( new_position + vec_translate ) ;

        // depth is being set to 0.45
        gl_Position = zoom * vec4( vec2(new_position), 0.45, 1);

      }
    `,

    frag: `

      precision highp float;
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
        [tri_height,    tri_width],
        [    0,  0.0],
        [tri_height,   -tri_width],
      ],

      // pass tri_offset_att_inst buffer
      tri_offset_att_inst: {
        buffer: regl.buffer(tri_offset_array_inst),
        divisor: 1
      },

      // pass tri_offset_att_inst buffer
      tri_offset_att_new: {
        buffer: regl.buffer(tri_offset_array_new),
        divisor: 1
      },

    },

    uniforms: {
      zoom: zoom_function,
      mat_rotate: mat_rotate,
      scale_y: scale_y,
      top_offset: top_offset,
      triangle_color: inst_rgba,
      total_zoom: total_zoom,
      // alternate way to define interpolate uni
      interp_uni: () => Math.max(0, Math.min(1, interp_fun(params))),
      run_animation: params.animation.running
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