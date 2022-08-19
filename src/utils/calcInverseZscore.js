export default (function calc_inverse_zscore(params) {
  const mat_data = params.mat_data;
  // Inv-Z-score data
  // ////////////////////////////////////////////
  const mat_data_iz = mat_data.map((inst_row, i) => {
    const inst_avg = params.network.pre_zscore.mean[i];
    const inst_std = params.network.pre_zscore.std[i];
    // z-score data
    const inst_row_iz = inst_row.map((x) => {
      x = x * inst_std + inst_avg;
      return x;
    });
    return inst_row_iz;
  });
  return mat_data_iz;
});
