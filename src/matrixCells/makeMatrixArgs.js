import { zoom_function } from "../cameras/zoomFunction";
import { setArrsState } from "../state/reducers/arrsSlice";
import make_opacity_arr from "./makeOpacityArr";
import make_position_arr from "./makePositionArr";

export default function make_matrix_args(regl, store) {
  const state = store.getState();

  // make arrays
  const arrs = {};
  arrs.opacity_arr = make_opacity_arr(store);
  arrs.position_arr = {};
  arrs.position_arr.ini = make_position_arr(
    state,
    state.order.inst.row,
    state.order.inst.col
  );
  arrs.position_arr.new = make_position_arr(
    state,
    state.order.new.row,
    state.order.new.col
  );
  store.dispatch(setArrsState(arrs));

  const opacity_buffer = regl.buffer({
    type: "float",
    usage: "dynamic",
  })(arrs.opacity_arr);
  const tile_width = state.visualization.viz_dim.tile_width;
  const tile_height = state.visualization.viz_dim.tile_height;
  const triangle_verts = [
    [tile_width, 0.0],
    [tile_width, tile_height],
    [0.0, tile_height],
    [tile_width, 0.0],
    [0.0, 0.0],
    [0.0, tile_height],
  ];
  const vert_string = `
    // precision highp float;
    precision lowp float;
    attribute vec2 position;
    attribute vec2 pos_att_ini, pos_att_new;
    attribute float opacity_att;
    uniform mat4 zoom;
    uniform bool run_animation;
    uniform float interp_uni;
    varying vec2 pos;

    // pass varying variables to fragment from vector
    varying float opacity_vary;

    void main() {

      // interpolate between the two positions using the interpolate uniform
      if (run_animation == true){
        pos = mix(pos_att_ini, pos_att_new, interp_uni);
      } else {
        pos = pos_att_ini;
      }

      gl_Position = zoom *
                    vec4( position.x + pos.x,
                          position.y + pos.y,
                          0.75,
                          1
                        );

      // pass attribute (in vert) to varying in frag
      opacity_vary = opacity_att;

    }`;
  const frag_string = `
    // precision highp float;
    precision lowp float;

    uniform vec3 pos_rgb;
    uniform vec3 neg_rgb;

    // use the varying being passed from the vertex shader
    varying float opacity_vary;

    void main() {

      if (opacity_vary > 0.0){
        // gl_FragColor = vec4(1, 0, 0, abs(opacity_vary));
        gl_FragColor = vec4(pos_rgb, abs(opacity_vary));
      } else {
        // gl_FragColor = vec4(0, 0, 1, abs(opacity_vary));
        gl_FragColor = vec4(neg_rgb, abs(opacity_vary));
      }

    }`;
  const num_instances = arrs.position_arr.ini.length;
  const inst_properties = {
    vert: vert_string,
    frag: frag_string,
    attributes: {
      position: triangle_verts,
      pos_att_ini: {
        buffer: regl.buffer(arrs.position_arr.ini),
        divisor: 1,
      },
      pos_att_new: {
        buffer: regl.buffer(arrs.position_arr.new),
        divisor: 1,
      },
      opacity_att: {
        buffer: opacity_buffer,
        divisor: 1,
      },
    },
    blend: {
      enable: true,
      func: {
        srcRGB: "src alpha",
        srcAlpha: 1,
        dstRGB: "one minus src alpha",
        dstAlpha: 1,
      },
      equation: {
        rgb: "add",
        alpha: "add",
      },
      color: [0, 0, 0, 0],
    },
    count: 6,
    uniforms: {
      zoom: zoom_function,
      interp_uni: (ctx, props) => Math.max(0, Math.min(1, props.interp_prop)),
      run_animation: regl.prop("run_animation"),
      pos_rgb: state.cat_viz.mat_colors.pos_rgb,
      neg_rgb: state.cat_viz.mat_colors.neg_rgb,
    },
    instances: num_instances,
    depth: {
      enable: false,
    },
  };
  // draw top and bottom of matrix cells
  // ////////////////////////////////////
  return inst_properties;
}
