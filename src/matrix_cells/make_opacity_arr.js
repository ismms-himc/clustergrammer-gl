var d3 = require("d3");
module.exports = function make_opacity_arr(params){

  console.log('************************************')
  console.log('************************************')
  console.log('make_opacity_arr')
  console.log('************************************')
  console.log('************************************')

  var opacity_arr = [].concat.apply([], params.mat_data);

  var abs_max_val = Math.abs(_.max(opacity_arr, function(d){
    return Math.abs(d);
  }));

  var opacity_scale = d3.scaleLinear();

  var opacity_domain = abs_max_val * params.matrix.opacity_scale;
  var opacity_range = 1.0;

  opacity_scale
    .domain([-opacity_domain, opacity_domain])
    .range([-opacity_range, opacity_range])
    .clamp(true);

  opacity_arr = opacity_arr.map(function(x) {
    return opacity_scale(x);
  });

  return opacity_arr;

};