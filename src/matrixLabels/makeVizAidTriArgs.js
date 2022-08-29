import { zoom_function } from "../cameras/zoomFunction";
import color_to_rgba from "../colors/colorToRgba";
import interpFun from "../draws/interpFun";
import { rotation, scaling } from "../draws/mat3Transform";
import make_viz_aid_tri_pos_arr from "./makeVizAidTriPosArr";

export default (function make_viz_aid_tri_args(regl, store, inst_axis) {
  const state = store.getState();
  const num_labels = state.labels["num_" + inst_axis];
  let tri_height;
  let tri_width;
  let mat_size;
  let top_offset;
  if (inst_axis === "col") {
    mat_size = state.visualization.viz_dim.heat_size.x;
    // keep positioned at matrix not heatmap (make room for categories)
    // making triangle smaller
    const reduce_height = state.visualization.zoom_data.x.total_zoom;
    tri_height = (mat_size / num_labels) * reduce_height;
    tri_width = mat_size / num_labels;
    // original top_offset calc (undercorrects)
    top_offset = -state.visualization.viz_dim.mat_size.y - tri_height;
  } else {
    // rows have fixed viz aid triangle 'heights'
    mat_size = state.visualization.viz_dim.heat_size.y;
    // tri_height = 0.0125;
    tri_height = 0.02;
    tri_width = mat_size / num_labels;
    top_offset = -state.visualization.viz_dim.mat_size.x - tri_height;
  }
  const tri_offset_array_inst = make_viz_aid_tri_pos_arr(store, inst_axis);
  const tri_offset_array_new = make_viz_aid_tri_pos_arr(store, inst_axis);
  // ///////////////////////////////
  // Rotation and Scaling
  // ///////////////////////////////
  const scale_y = scaling(2, 1);
  let rotation_radians;
  if (inst_axis === "row") {
    rotation_radians = 0;
  } else if (inst_axis === "col") {
    rotation_radians = Math.PI / 2;
  }
  const mat_rotate = rotation(rotation_radians);
  const total_zoom = state.visualization.zoom_data.x.total_zoom;
  const inst_rgba = color_to_rgba("#eee", 1.0);
  // want to be able to set color based on search status
  const color_arr_ini = Array(num_labels).fill(inst_rgba);
  const searched_rows = state.search.searched_rows;
  // change color of selected rows
  const color_arr = color_arr_ini.map((x, i) => {
    if (inst_axis === "row") {
      const inst_name = state.network.row_node_names[i];
      if (searched_rows.includes(inst_name)) {
        x = color_to_rgba("red", 1.0);
      }
    }
    return x;
  });
  const color_buffer = regl.buffer({
    length: num_labels,
    usage: "dynamic",
  });
  color_buffer(color_arr);
  const args = {
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

      attribute vec4 color_att;
      varying vec4 color_vary;

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
        new_position = mat_rotate * ( new_position + vec_translate );

        // depth is being set to 0.45
        gl_Position = zoom * vec4( vec2(new_position), 0.45, 1);

        // pass attribute (in vert) to varying in frag
        color_vary = color_att;
      }
    `,
    frag: `

      precision highp float;
      // uniform vec4 triangle_color;
      varying vec4 color_vary;

      // color triangle red
      void main () {

        // // defining the triangle color using a uniform
        // gl_FragColor = triangle_color;

        // define the triangle color using a varying
        gl_FragColor = color_vary;

      }

    `,
    // passing a fixed value for the triangle position
    attributes: {
      ini_position: [
        [tri_height, 0],
        [0, -tri_width],
        [tri_height, -2 * tri_width],
      ],
      // pass tri_offset_att_inst buffer
      tri_offset_att_inst: {
        buffer: regl.buffer(tri_offset_array_inst),
        divisor: 1,
      },
      // pass tri_offset_att_inst buffer
      tri_offset_att_new: {
        buffer: regl.buffer(tri_offset_array_new),
        divisor: 1,
      },
      color_att: {
        buffer: color_buffer,
        divisor: 1,
      },
    },
    uniforms: {
      zoom: zoom_function,
      mat_rotate: mat_rotate,
      scale_y: scale_y,
      top_offset: top_offset,
      // triangle_color: inst_rgba,
      total_zoom: total_zoom,
      // alternate way to define interpolate uni
      interp_uni: () => Math.max(0, Math.min(1, interpFun(store))),
      run_animation: state.animation.running,
    },
    count: 3,
    instances: num_labels,
    depth: {
      enable: true,
      mask: true,
      func: "less",
      // func: 'greater',
      range: [0, 1],
    },
  };
  return args;
});
