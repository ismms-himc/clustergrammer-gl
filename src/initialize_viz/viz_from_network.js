module.exports = function viz_from_network(){

  this.initialize_containers();
  this.initialize_regl();

  console.log('viz_from_network')
  // define parameters and run visualization
  this.initialize_params();
  this.build_control_panel();
  this.ini_canvas_mouseover();
  this.run_viz();
};