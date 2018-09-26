module.exports = function final_interaction_frame(regl, params){

  // reduce the number of interactions
  params.interact.total = params.interact.total - 1;

  if (params.interact.total == 0 && params.animation.initialize_viz == false){

    // preventing from running on first frame
    if (params.animation.first_frame == false){

      // run draw commands
      params.labels.draw_labels = true;

      if (params.zoom_data.x.total_mouseover == 0){
        // console.log('SLOW_DRAW')
      }

    } else {

      params.animation.first_frame = false;
    }
  }

};