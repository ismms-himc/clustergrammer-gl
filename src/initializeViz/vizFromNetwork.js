import build_dendrogram_sliders from "../dendrogram/buildDendrogramSliders";
import run_viz from "../draws/runViz";
import ini_canvas_mouseover from "./iniCanvasMouseover";

export default function viz_from_network(cgm, external_model) {
  let newCgm = cgm;
  newCgm.canvas_container = newCgm.initialize_containers(newCgm);
  newCgm = newCgm.initialize_regl(newCgm);
  // define parameters and run visualization
  newCgm = newCgm.initialize_params(newCgm, external_model);
  newCgm = newCgm.build_control_panel(newCgm);
  build_dendrogram_sliders(newCgm);
  ini_canvas_mouseover(newCgm);
  run_viz(newCgm, external_model);

  return newCgm;
}
