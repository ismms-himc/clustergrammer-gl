import { Store } from "@reduxjs/toolkit";
import { Regl } from "regl";
import { zoom_function } from "../../cameras/zoomFunction";
import color_to_rgba from "../../colors/colorToRgba";
import { rotation, scaling } from "../../draws/mat3Transform";
import { RootState } from "../../state/store/store";
import { CatArrs } from "./catArgsManager";
import get_cat_value from "./helpers/getCatValue";

type ReglProps = { run_animation: boolean };

export default (function makeCatArgs(
  regl: Regl,
  store: Store<RootState>,
  cat_arrs: CatArrs,
  inst_axis: string,
  cat_index: number
) {
  const {
    labels,
    visualization: { viz_dim },
    tooltip,
    network,
    cat_viz,
    interaction,
  } = store.getState();
  const cat_index_name = "cat-" + String(cat_index);
  /*
  
    Hacking Categories Plan
    ------------------------
    Make a buffer of vec4's that will pass rgba data for the different category
    colors. Then pass this as an attribute (or varying?) to the fragment shader.
  
    */
  const inst_rgba = color_to_rgba("purple", 0.95);
  const num_labels = labels["num_" + inst_axis];
  // category widths depend on the number of labels
  let cat_width;
  let mat_size;
  let top_shift_triangles;
  // category tiles have fixed heights
  const cat_height = 0.04;
  if (inst_axis === "col") {
    mat_size = viz_dim.heat_size.x;
    top_shift_triangles = viz_dim.mat_size.y;
    cat_width = mat_size / 0.5 / num_labels;
  } else {
    mat_size = viz_dim.heat_size.y;
    top_shift_triangles = viz_dim.mat_size.x;
    cat_width = viz_dim.heat_size.y / 0.5 / num_labels;
  }
  const shift_cat = 0.025 * (cat_index + 1);
  const top_offset = -top_shift_triangles - cat_height + shift_cat;
  // ///////////////////////////////
  // Label Color Buffer
  // ///////////////////////////////
  let is_mousing_over_cat = false;
  let inst_opacity = 1.0;
  let mousing_over_cat;
  // if mousing over categories initialize all categories to low opacity
  if (tooltip.tooltip_type) {
    if (tooltip.tooltip_type.includes("-cat-")) {
      is_mousing_over_cat = true;
      const mouseover_cat_index = tooltip.tooltip_type.split("-")[2];
      mousing_over_cat =
        interaction.mouseover[inst_axis].cats[mouseover_cat_index];
    }
  }
  let is_cat_value = false;
  if (cat_viz.cat_info[inst_axis][cat_index_name].type === "cat_values") {
    is_cat_value = true;
  }
  /* Category Colors */
  // //////////////////////////
  // String based categories are working
  // Working on value-based categories
  const color_arr = [];
  let inst_value_color;
  let ini_cat_value;
  for (let i = 0; i < num_labels; i++) {
    const inst_cat = network[inst_axis + "_nodes"][i][cat_index_name];
    // Check if value-based category
    if (is_cat_value) {
      ini_cat_value = get_cat_value(inst_cat);
      inst_opacity = cat_viz.cat_info[inst_axis][cat_index_name].cat_scale(
        Math.abs(ini_cat_value)
      );
      // get positive and negative colors
      let ini_value_color;
      if (ini_cat_value > 0) {
        ini_value_color = cat_viz.cat_value_colors[0];
      } else {
        ini_value_color = cat_viz.cat_value_colors[1];
      }
      // inst_value_color = viz.cat_value_colors[0];
      inst_value_color = color_to_rgba(ini_value_color).map(
        (x) => x * inst_opacity + (1 - inst_opacity)
      );
    }
    // Set Category Colors
    // /////////////////////////
    let inst_color: string | number[] | undefined;
    if (is_cat_value === false) {
      if ("cat_colors" in network) {
        if (cat_index_name in network.cat_colors[inst_axis]) {
          try {
            // inst_color = network.cat_colors[inst_axis][cat_index_name][inst_cat];
            inst_color = cat_viz.global_cat_colors[inst_cat.split(": ")[1]];
          } catch (err) {
            // get random colors from color dictionary
            inst_color = "white";
          }
        } else {
          // get random colors from color dictionary
          inst_color = "white";
        }
      } else {
        // get random colors from color dictionary
        inst_color = "white";
      }
    } else {
      inst_color = inst_value_color;
    }
    // Mouseover highlight
    // /////////////////////////
    // switch non-highlighted colors to white (avoid opacity bug)
    inst_opacity = 1.0;
    const blend_fraction = 0.25;
    if (inst_color === undefined || typeof inst_color === "string") {
      if (is_mousing_over_cat) {
        if (mousing_over_cat === inst_cat) {
          if (is_cat_value === false) {
            inst_color = color_to_rgba(inst_color, inst_opacity);
          }
        } else {
          // not currently selected category
          if (is_cat_value === false) {
            inst_color = color_to_rgba(inst_color, inst_opacity).map(
              (x) => x * blend_fraction + (1 - blend_fraction)
            );
          }
        }
      } else {
        if (is_cat_value === false) {
          inst_color = color_to_rgba(inst_color, inst_opacity);
        }
      }
    }
    color_arr[i] = inst_color;
  }
  const color_buffer = regl.buffer({
    length: num_labels,
    usage: "dynamic",
  });
  color_buffer(color_arr);
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
  const args = {
    vert: `
      precision highp float;
      attribute vec2 ini_position;
      attribute vec2 cat_pos_att_inst;
      attribute vec2 cat_pos_att_new;
      uniform float interp_uni;
      uniform bool run_animation;


      uniform mat3 mat_rotate;
      uniform mat3 scale_y;
      uniform mat4 zoom;
      uniform float top_offset;

      varying vec3 new_position;
      varying vec3 vec_translate;
      varying vec2 cat_pos;

      // pass varying variable to fragment from vector
      attribute vec4 color_att;
      varying vec4 color_vary;

      void main () {

        new_position = vec3(ini_position, 0);

        // interpolate between the two positions using the interpolate uniform
        if (run_animation == true){
          cat_pos = mix(cat_pos_att_inst, cat_pos_att_new, interp_uni);
        } else {
          cat_pos = cat_pos_att_inst;
        }

        vec_translate = vec3(top_offset, cat_pos[0], 0);

        // rotate translated triangles
        new_position = mat_rotate * ( new_position + vec_translate ) ;

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
        [cat_height, cat_width / 2],
        [cat_height / 2, cat_width / 2],
        [cat_height, -cat_width / 2],
        [cat_height / 2, -cat_width / 2],
        [cat_height, -cat_width / 2],
        [cat_height / 2, cat_width / 2],
      ],
      cat_pos_att_inst: {
        buffer: regl.buffer(cat_arrs.inst[inst_axis][cat_index]),
        divisor: 1,
      },
      cat_pos_att_new: {
        buffer: regl.buffer(cat_arrs.new[inst_axis][cat_index]),
        divisor: 1,
      },
      // pass color buffer
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
      triangle_color: inst_rgba,
      interp_uni: (ctx: any, props: any) =>
        Math.max(0, Math.min(1, props.interp_prop)),
      run_animation: regl.prop<ReglProps, keyof ReglProps>("run_animation"),
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
    instances: num_labels,
    depth: {
      enable: true,
      mask: true,
      func: "less",
      range: [0, 1],
    },
  };
  return args;
});
