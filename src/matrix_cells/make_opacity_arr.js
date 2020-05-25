var d3 = require("d3");
var average = require('./../utils/average')
var standard_deviation = require('./../utils/standard_deviation')

module.exports = function make_opacity_arr(params){

  // console.log('************************************')
  // console.log('************************************')
  // console.log('make_opacity_arr')
  // console.log('************************************')
  // console.log('************************************')

  console.log('make_opacity_arr')

  let inst_avg
  let inst_std

  mat_data = params.mat_data

  // // Z-score data
  // let mat_data_z = mat_data.map(inst_row => {

  //   inst_avg = average(inst_row)
  //   inst_std = standard_deviation(inst_row)

  //   // z-score data
  //   inst_row_z = inst_row.map(x => {
  //     x = (x - inst_avg)/inst_std
  //     return x
  //   })

  //   return inst_row_z
  // })

  // console.log(mat_data_z)

  var opacity_arr = [].concat.apply([], mat_data);

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