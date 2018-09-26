module.exports = function keep_track_of_mouseovers(params){

  // keep track of mouseovers
  if (params.interact.still_mouseover == false){

    params.interact.still_mouseover = true;

    // wait some time to confirm still not interacting
    setTimeout(function(){
      params.interact.still_mouseover = false;
    }, 1000);

  }

};