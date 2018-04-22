var make_position_arr = require('./make_position_arr');
var make_opacity_arr = require('./make_opacity_arr');

module.exports = function make_draw_cells_arr(regl, params){

  // Make Arrays
  var opacity_arr = make_opacity_arr(params);
  var position_arr = make_position_arr(params);

  var arrs = {};
  arrs.opacity_arr = opacity_arr;
  arrs.position_arr = position_arr;

  // arrs.opacity_arr = arrs.opacity_arr.slice(10,20);
  // arrs.position_arr = arrs.position_arr.slice(10,20);

  console.log('hard filtering')
  console.log(arrs.opacity_arr.length)

  /*
  Make initial array and then only keep elements that have opacity above some
  value as a test. We might try to only render the top opacity elements while
  zooming to speed up interaction.
  */

  // _.each(arrs.opacity_arr, function(d){
    // console.log(d)
  // })

  return arrs;

};