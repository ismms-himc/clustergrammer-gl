export default function viz_from_network(cgm, external_model) {
  let newCgm = cgm;
  newCgm.canvas_container = newCgm.initialize_containers(newCgm);
  const regl = newCgm.initialize_regl();
  newCgm.regl = regl;
  // define parameters and run visualization
  newCgm = newCgm.initialize_params(newCgm, external_model);
  newCgm = newCgm.build_control_panel(cgm_with_params);
  newCgm.build_dendrogram_sliders(newCgm);
  newCgm.ini_canvas_mouseover(newCgm);
  newCgm.run_viz(newCgm, external_model);

  return newCgm;
}
