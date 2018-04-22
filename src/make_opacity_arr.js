module.exports = function make_opacity_arr(params){

  var mat_data = params.mat_data;

  var opacity_arr = [].concat.apply([], mat_data);

  var abs_max_val = _.max(opacity_arr, function(d){
    return Math.abs(d);
  });

  var opacity_scale = d3.scale.linear();

  var opacity_domain = abs_max_val /1.5;
  var opacity_range = 0.80;

  opacity_scale
    .domain([-opacity_domain, opacity_domain])
    .range([-opacity_range, opacity_range])
    .clamp(true);

  opacity_arr = opacity_arr.map(function(x) {
    return opacity_scale(x);
  });

  return opacity_arr;

};