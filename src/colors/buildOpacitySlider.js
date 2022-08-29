// TODO: fix invalid this usage

import * as d3 from "d3";
import { clamp } from "lodash";
import draw_webgl_layers from "../draws/drawWebglLayers.js";
import { setOpacityScale } from "../state/reducers/matrixSlice.js";
import custom_round from "../utils/customRound.js";

export default (function build_opacity_slider(
  regl,
  store,
  catArgsManager,
  camerasManager
) {
  const state = store.getState();
  const slider_length = 100;
  const rect_height = slider_length + 20;
  const rect_width = 20;
  const round_level = -1;

  // convert from position along slider to a value that will be used to set
  // the group level
  function get_slider_value(slider_position) {
    return 1 - clamp(clamp(slider_position, 1, 90) / slider_length, 0.25, 0.9);
  }

  function change_opacity(slider_value) {
    slider_value = custom_round(slider_value, 2);
    store.dispatch(setOpacityScale(slider_value));
    camerasManager.remakeMatrixArgs(store);
    draw_webgl_layers(regl, store, catArgsManager, camerasManager);
  }

  const getSliderPos = (el) => {
    if (el.nextSibling) {
      el.parentNode.appendChild(el);
    }
    return custom_round(clamp(d3.event.y, 0, slider_length), round_level);
  };

  function updateOpacityAndSlider(pos) {
    // get the value of the slider
    const slider_value = get_slider_value(pos);
    // move the slider dot
    d3.select(
      state.visualization.rootElementId + " .opacity_group_circle"
    ).attr("transform", `translate(0, ${pos})`);
    // update the slider text
    d3.select(`${state.visualization.rootElementId} .opacity_level_text`).text(
      1 - custom_round(slider_value, 1)
    );
    // change the opacity of the matrix cells
    change_opacity(slider_value);
  }

  function click_opacity_slider() {
    const clicked_line_position = d3.mouse(this);
    const rel_pos = custom_round(clicked_line_position[1], round_level);
    updateOpacityAndSlider(rel_pos);
  }

  function dragging() {
    const slider_pos = getSliderPos(this);
    updateOpacityAndSlider(slider_pos);
  }

  const drag = d3
    .drag()
    .on("drag", dragging)
    .on("end", function () {
      const slider_pos = getSliderPos(this);
      const slider_value = get_slider_value(slider_pos);
      d3.select(this).attr("transform", `translate(0, ${slider_pos})`);
      change_opacity(slider_value);
    });

  const slider_group = d3
    .select(state.visualization.rootElementId + " .control_svg")
    .append("g")
    .classed("opacity_slider_group", true)
    .attr("transform", function () {
      const inst_translation = `translate(${rect_width / 2}, ${
        rect_height / 10
      })`;
      return inst_translation;
    })
    .attr("transform", "translate(435, 110), rotate(-90)");
  slider_group
    .append("rect")
    .classed("opacity_slider_background", true)
    .attr("height", rect_height + "px")
    .attr("width", rect_width + "px")
    .attr("fill", "red")
    .attr("transform", function () {
      const translate_string = "translate(-10, -5)";
      return translate_string;
    })
    .attr("opacity", 0);
  slider_group
    .append("line")
    .attr("stroke-width", slider_length / 7 + "px")
    .attr("stroke", "black")
    .attr("stroke-linecap", "round")
    .attr("opacity", 0.0)
    .attr("y1", 0)
    .attr("y2", function () {
      return slider_length - 2;
    });

  const offset_triangle = -slider_length / 40;
  slider_group
    .append("path")
    .attr("fill", "black")
    .attr("transform", `translate(${offset_triangle}, 0)`)
    .attr("d", function () {
      // up triangle
      const start_x = 0;
      const start_y = 0;
      const mid_x = 0;
      const mid_y = slider_length;
      const final_x = slider_length / 10;
      const final_y = slider_length;
      const output_string = `M${start_x},${start_y} L${mid_x},${mid_y} L${final_x},${final_y} Z`;
      return output_string;
    })
    .attr("opacity", 0.35)
    .on("click", click_opacity_slider);

  const default_opacity = 0.35;
  const high_opacity = 0.6;
  slider_group
    .append("circle")
    .classed("opacity_group_circle", true)
    .attr("r", slider_length * 0.08)
    .attr("transform", function () {
      return `translate(0, ${slider_length / 2})`;
    })
    .attr("fill", "blue")
    .attr("opacity", default_opacity)
    .on("mouseover", function () {
      d3.select(this).attr("opacity", high_opacity);
    })
    .on("mouseout", function () {
      d3.select(this).attr("opacity", default_opacity);
    })
    .call(drag);
  const text_color = "#47515b";
  const button_dim = {};
  button_dim.height = 32;
  button_dim.width = 63;
  button_dim.buffer = 12;
  button_dim.x_trans = button_dim.width + button_dim.buffer;
  button_dim.fs = 11;
  // add opacity level text
  // /////////////////////////////
  slider_group
    .append("text")
    .text("opacity".toUpperCase())
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("font-size", button_dim.fs)
    .attr("text-anchor", "middle")
    .attr("stroke", text_color)
    .attr("alignment-baseline", "middle")
    .attr("letter-spacing", "2px")
    .attr("cursor", "default")
    .attr("transform", "translate(10, 140), rotate(90)");
  slider_group
    .append("text")
    .classed("opacity_level_text", true)
    .text(state.matrix.opacity_scale)
    .attr("transform", "translate(-5, 140) rotate(90)")
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("font-size", 11)
    .attr("text-anchor", "right")
    .attr("stroke", text_color)
    .attr("alignment-baseline", "middle")
    .attr("letter-spacing", "2px")
    .attr("cursor", "default");
});
