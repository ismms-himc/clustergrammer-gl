export default (function final_interaction_frame(regl, params) {
  // reduce the number of interactions
  params.int.total = params.int.total - 1;
  if (params.int.total == 0 && params.ani.ini_viz == false) {
    // preventing from running on first frame
    if (params.ani.first_frame == false) {
      // run draw commands
      params.labels.draw_labels = true;
    } else {
      params.ani.first_frame = false;
    }
  }
});
