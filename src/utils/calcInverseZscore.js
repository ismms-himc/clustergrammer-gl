import { mutateNetworkState } from "../state/reducers/networkSlice";

export default (function calc_inverse_zscore(store) {
  const state = store.getState();
  const mat_data = state.network.mat;
  // Inv-Z-score data
  // ////////////////////////////////////////////
  const mat_iz = mat_data.map((inst_row, i) => {
    const inst_avg = state.network.pre_zscore.mean[i];
    const inst_std = state.network.pre_zscore.std[i];
    // z-score data
    const inst_row_iz = inst_row.map((x) => {
      x = x * inst_std + inst_avg;
      return x;
    });
    return inst_row_iz;
  });
  store.dispatch(
    mutateNetworkState({
      mat_iz,
    })
  );
});
