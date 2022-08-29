import interpFun from "../draws/interpFun";
import { rotation, scaling } from "../draws/mat3Transform";

export default function make_col_text_args(regl, store, zoom_function) {
  const state = store.getState();

  const inst_axis = "col";
  const num_col = state.labels["num_" + inst_axis];
  const col_width = state.visualization.viz_dim.heat_size.x / num_col;

  let scale_text = num_col;
  const webgl_fs = (1 / num_col) * state.visualization.zoom_data.x.total_zoom;
  const max_webgl_fs = state.visualization.text_zoom.col.max_webgl_fs;
  let scale_down_fs;
  if (webgl_fs > max_webgl_fs) {
    scale_down_fs = webgl_fs / max_webgl_fs;
    scale_text = scale_text * scale_down_fs;
  }
  const mat_rotate = rotation(Math.PI / 4);
  const text_y_scale = scaling(1, state.visualization.zoom_data.x.total_zoom);
  // need to shift col labels up to counteract the rotation by 45%
  const rh_tri_hyp = col_width;
  const rh_tri_side = rh_tri_hyp / Math.sqrt(2);
  const shift_text_out = 0.0;
  const shift_text_right = col_width;
  // make up for rotating text
  const shift_text_up = -0.5 * rh_tri_side;
  const vert_arg = `
      precision mediump float;
      attribute vec2 position;
      uniform mat4 zoom;
      uniform vec2 inst_offset;
      uniform vec2 new_offset;
      uniform float y_offset;
      uniform float scale_text;
      uniform mat3 mat_rotate;
      uniform mat3 text_y_scale;
      uniform float total_zoom;
      uniform float col_width;
      varying vec3 rotated_text;
      varying vec3 position_cols;
      uniform float heat_size;
      varying vec3 xy_positions;
      varying float x_position;
      varying float y_position;
      uniform float shift_text_out;
      uniform float shift_text_right;
      uniform float shift_text_up;
      uniform float shift_heat;
      uniform float interp_uni;
      uniform bool run_animation;
      varying vec2 mixed_offset;

      // last value is a sort-of zoom
      void main () {

        // rotate, reduce size, stretch in y, and give text triangles positions
        // shifting text up in the original text triangle units
        rotated_text = text_y_scale *
                       mat_rotate *
                       vec3(position.y/scale_text, position.x/scale_text, 0.0);

        // the y position is constant for all column labels
        //---------------------------------------------------------------
        // working on shifting text up
        //---------------------------------------------------------------
        y_position = y_offset;

        // the x position varies for all column labelss
        //---------------------------------------------------------------
        // interpolate between the two positions using the interpolate uniform
        if (run_animation){
          mixed_offset = mix(inst_offset, new_offset , interp_uni);
        } else {
          mixed_offset = inst_offset;
        }

        // mixed_offset = inst_offset;

        x_position = (mixed_offset[1] * 2.0 * heat_size + shift_heat + shift_text_right);

        position_cols = vec3( x_position, y_position, 0.10);

        xy_positions = rotated_text + position_cols;

        // reverse y position to get words to be upright
        ////////////////////////////
        // vec4: x, y, depth, zoom
        ////////////////////////////
        gl_Position = zoom * vec4( xy_positions, 1.0);

      }`;
  const frag_arg = `
      precision mediump float;
      void main () {
        gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
      }`;
  const args = {
    vert: vert_arg,
    frag: frag_arg,
    attributes: {
      position: regl.prop("positions"),
    },
    elements: regl.prop("cells"),
    uniforms: {
      zoom: zoom_function,
      inst_offset: regl.prop("inst_offset"),
      new_offset: regl.prop("new_offset"),
      scale_text: scale_text,
      y_offset: state.visualization.viz_dim.mat_size.y,
      heat_size: state.visualization.viz_dim.heat_size.x,
      shift_heat:
        state.visualization.viz_dim.mat_size.x -
        state.visualization.viz_dim.heat_size.x,
      shift_text_right: shift_text_right,
      shift_text_out: shift_text_out,
      shift_text_up: shift_text_up,
      mat_rotate: mat_rotate,
      text_y_scale: text_y_scale,
      total_zoom: state.visualization.zoom_data.x.total_zoom,
      col_width: col_width,
      // alternate way to define interpolate uni
      interp_uni: () => Math.max(0, Math.min(1, interpFun(store))),
      run_animation: state.animation.running,
    },
    depth: {
      enable: true,
      mask: true,
      func: "less",
      range: [0, 1],
    },
  };
  return args;
}
