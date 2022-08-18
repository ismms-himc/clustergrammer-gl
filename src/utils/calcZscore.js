var average = require("./average");
var standard_deviation = require("./standard_deviation");
module.exports = function calc_zscore(params) {
  console.log("calc_zscore ????????????  ");

  mat_data = params.mat_data;

  // Z-score data
  //////////////////////////////////////////////
  let mat_data_z = mat_data.map((inst_row) => {
    inst_avg = average(inst_row);
    inst_std = standard_deviation(inst_row);

    // console.log(inst_avg, inst_std)

    // z-score data
    inst_row_z = inst_row.map((x) => {
      x = (x - inst_avg) / inst_std;
      return x;
    });

    return inst_row_z;
  });

  params.mat_data_z = mat_data_z;
};
