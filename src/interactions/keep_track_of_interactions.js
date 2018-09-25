module.exports = function keep_track_of_interactions(params){

  var wait_time_final_interact = 100;

  // keep track of interactions
  if (params.still_interacting == false){

    params.still_interacting = true;

    // wait some time to confirm still not interacting
    setTimeout(function(){
      params.still_interacting = false;
    }, wait_time_final_interact);

  }

};