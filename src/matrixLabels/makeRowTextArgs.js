import interpFun from "../draws/interpFun";
import { rotation } from "../draws/mat3Transform";

export default function make_row_text_args(regl, store, zoom_function) {
  const state = store.getState();

  const inst_axis = "row";
  const num_row = state.labels["num_" + inst_axis];
  let scale_text = num_row;
  const webgl_fs = (1 / num_row) * state.visualization.zoom_data.y.total_zoom;
  const max_webgl_fs = state.visualization.text_zoom.row.max_webgl_fs;
  let scale_down_fs;
  if (webgl_fs > max_webgl_fs) {
    scale_down_fs = webgl_fs / max_webgl_fs;
    scale_text = scale_text * scale_down_fs;
  }
  const mat_rotate = rotation(Math.PI / 2);
  const x_offset = state.visualization.viz_dim.mat_size.x + 0.02;
  const vert_arg = `
      precision mediump float;
      attribute vec2 position;
      uniform mat4 zoom;
      uniform vec2 inst_offset;
      uniform vec2 new_offset;
      uniform float x_offset;
      uniform float scale_text;
      uniform float total_zoom;
      uniform mat3 mat_rotate;
      uniform float heat_size;
      varying float x_position;
      varying float y_position;
      uniform float shift_heat;
      uniform float interp_uni;
      uniform bool run_animation;
      varying vec2 mixed_offset;

      // vec3 tmp = vec3(1,1,1);

      // last value is a sort-of zoom
      void main () {

        // reverse y position to get words to be upright

        // the x position is constant for all row labels
        //------------------------------------------------------
        // total_zoom stretches out row labels horizontally
        // then text is offset to the left side of the heatmap
        //------------------------------------------------------
        x_position = position.x/scale_text * total_zoom - x_offset;

        // the y position varies for all row labels
        //------------------------------------------------------
        // shift by offset and then uniformly shift down by s
        // shift_heat
        //------------------------------------------------------
        // interpolate between the two positions using the interpolate uniform
        if (run_animation){
          mixed_offset = mix(inst_offset, new_offset , interp_uni);
        } else {
          mixed_offset = inst_offset;
        }

        // mixed_offset = inst_offset;

        y_position = -position.y/scale_text + 2.0 * heat_size * mixed_offset[1] - shift_heat ;

        gl_Position = zoom *
                      vec4(x_position,
                           y_position,
                           0.50,
                           1.0);
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
      x_offset: x_offset,
      heat_size: state.visualization.viz_dim.heat_size.y,
      shift_heat:
        state.visualization.viz_dim.mat_size.y -
        state.visualization.viz_dim.heat_size.y,
      total_zoom: state.visualization.zoom_data.y.total_zoom,
      mat_rotate: mat_rotate,
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
