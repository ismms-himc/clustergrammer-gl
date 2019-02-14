module.exports = function keep_track_of_mouseovers(params){

  // keep track of mouseovers
  if (params.int.still_mouseover == false){

    params.int.still_mouseover = true;

    // wait some time to confirm still not interacting
    setTimeout(function(){
      params.int.still_mouseover = false;
    }, 1000);

  }

};