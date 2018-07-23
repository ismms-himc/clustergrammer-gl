module.exports = function keep_track_of_mouseovers(params){

  // keep track of mouseovers
  if (params.still_mouseover == false){

    params.still_mouseover = true;

    // wait some time to confirm still not interacting
    setTimeout(function(){
      params.still_mouseover = false;
    }, 1000);

  }

};