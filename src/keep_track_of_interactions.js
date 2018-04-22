module.exports = function keep_track_of_interactions(params){

  // keep track of interactions
  if (params.still_interacting == false){

    params.still_interacting = true;

    // wait some time to confirm still not interacting
    setTimeout(function(){
      params.still_interacting = false;
    }, 1000);

  }

};