module.exports = function calc_inverse_zscore(params) {
  mat_data = params.mat_data;

  // Inv-Z-score data
  //////////////////////////////////////////////
  let mat_data_iz = mat_data.map((inst_row, i) => {
    inst_avg = params.network.pre_zscore.mean[i];
    inst_std = params.network.pre_zscore.std[i];

    // z-score data
    inst_row_iz = inst_row.map((x) => {
      x = x * inst_std + inst_avg;
      return x;
    });

    return inst_row_iz;
  });

  params.mat_data_iz = mat_data_iz;
};
