import drawCommands from "./drawCommands.js";
import finalInteractionFrame from "../interactions/finalInteractionFrame.js";
export default (function draw_interacting(cgm, external_model) {
  let regl = cgm.regl;
  let params = cgm.params;
  var wait_time_final_interact = 100;
  params.int.total = params.int.total + 1;
  drawCommands(cgm, external_model);
  setTimeout(finalInteractionFrame, wait_time_final_interact, regl, params);
  params.ani.ini_viz = false;
  if (params.ani.time_remain > 0) {
    params.ani.time_remain = params.ani.time_remain - 1;
  }
});
