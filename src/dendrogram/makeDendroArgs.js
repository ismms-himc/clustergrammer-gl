import { zoom_function } from "../cameras/zoomFunction";
import color_to_rgba from "../colors/colorToRgba";
import { rotation, scaling } from "../draws/mat3Transform";
import make_dendro_arr from "./makeDendroArr";

export default (function makeDendroArgs(regl, store, inst_axis) {
  const state = store.getState();

  let rotation_radians;
  let heat_size;
  let mat_size_offset;
  if (inst_axis === "row") {
    rotation_radians = 0;
    heat_size = state.visualization.viz_dim.heat_size.y;
    mat_size_offset = state.visualization.viz_dim.mat_size.x;
  } else if (inst_axis === "col") {
    rotation_radians = Math.PI / 2;
    heat_size = state.visualization.viz_dim.heat_size.x;
    mat_size_offset = state.visualization.viz_dim.mat_size.y;
  }
  const num_labels = state.labels["num_" + inst_axis];
  const dendro_width = state.dendro.tri_height;
  const tri_width = heat_size / num_labels;
  const dendro_arr = make_dendro_arr(store, inst_axis);
  const dendro_buffer = regl.buffer({
    length: dendro_arr.length,
    type: "float",
    usage: "dynamic",
  });
  dendro_buffer(dendro_arr);
  const mat_scale = scaling(1, 1);
  const mat_rotate = rotation(rotation_radians);
  const inst_rgba = color_to_rgba("black", 0.35);
  const args = {
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
        [state.dendro.trap_float, 2 * tri_width],
        [dendro_width, tri_width],
        [state.dendro.trap_float, 0],
      ],
      dendro_att: {
        buffer: dendro_buffer,
        divisor: 1,
      },
    },

    uniforms: {
      zoom: zoom_function,
      mat_rotate: mat_rotate,
      mat_scale: mat_scale,
      mat_size_offset: mat_size_offset,
      triangle_color: inst_rgba,
    },

    count: 3,
    instances: dendro_arr.length,
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
