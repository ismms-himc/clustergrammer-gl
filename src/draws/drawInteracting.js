import finalInteractionFrame from "../interactions/finalInteractionFrame";
import drawCommands from "./drawCommands";
export default (function draw_interacting(cgm, external_model) {
  const regl = cgm.regl;
  const params = cgm.params;
  const wait_time_final_interact = 100;
  params.int.total = params.int.total + 1;
  drawCommands(cgm, external_model);
  setTimeout(finalInteractionFrame, wait_time_final_interact, regl, params);
  params.ani.ini_viz = false;
  if (params.ani.time_remain > 0) {
    params.ani.time_remain = params.ani.time_remain - 1;
  }
});
