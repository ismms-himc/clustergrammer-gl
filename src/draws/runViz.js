import * as d3 from "d3";
import reset_cameras from "../cameras/resetCameras";
import draw_background_calculations from "./drawBackgroundCalculations";
import draw_interacting from "./drawInteracting";
import draw_mouseover from "./drawMouseover";
import end_animation from "./endAnimation";
import start_animation from "./startAnimation";

export default function run_viz(cgm, external_model) {
  const regl = cgm.regl;
  const params = cgm.params;
  params.ani.first_frame = true;
  regl.frame(function ({ time }) {
    params.ani.time = time;
    if (params.int.total > 1) {
      d3.selectAll(params.root + " .group-svg-tooltip").remove();
    }
    // prevent this from being negative, can happen when resetting zoom
    if (params.int.total < 0) {
      params.int.total = 0;
    }
    if (params.reset_cameras) {
      reset_cameras(regl, params);
    }
    if (params.ani.run_animation) {
      start_animation(params);
    } else if (
      params.ani.time > params.ani.duration_end &&
      params.ani.running === true
    ) {
      end_animation(cgm);
    }
    if (
      params.int.still_interacting == true ||
      params.ani.ini_viz == true ||
      params.ani.running == true ||
      params.ani.update_viz == true
    ) {
      draw_interacting(cgm, external_model);
      params.ani.update_viz = false;
    } else if (params.int.still_mouseover == true) {
      // mouseover may result in draw command
      draw_mouseover(regl, params);
      draw_background_calculations(regl, params);
    } else if (
      params.labels.draw_labels ||
      params.tooltip.show_tooltip ||
      params.dendro.update_dendro
    ) {
      cgm.draw_labels_tooltips_or_dendro(cgm, external_model);
    } else {
      // run background calculations
      draw_background_calculations(regl, params);
    }
  });
}
