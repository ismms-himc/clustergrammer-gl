module.exports = function viz_from_network(external_model) {
  this.initialize_containers();
  this.initialize_regl();

  // define parameters and run visualization
  this.initialize_params(external_model);
  this.build_control_panel();
  this.build_dendrogram_sliders();
  this.ini_canvas_mouseover();
  this.run_viz(external_model);
};
