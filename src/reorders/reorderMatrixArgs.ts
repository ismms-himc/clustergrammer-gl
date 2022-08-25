import { Store } from "@reduxjs/toolkit";
import { Regl } from "regl";
import { CamerasManager } from "../cameras/camerasManager";
import makePositionArr from "../matrixCells/makePositionArr";
import { RootState } from "../state/store/store";

export default (function reorderMatrixArgs(
  regl: Regl,
  store: Store<RootState>,
  camerasManager: CamerasManager
) {
  const state = store.getState();

  // calculate new ordering
  const newPositionArray = makePositionArr(
    state,
    state.order.new.row,
    state.order.new.col
  );
  camerasManager.mutateReglProps({
    attributes: {
      pos_att_new: {
        buffer: regl.buffer(newPositionArray),
        divisor: 1,
      },
    },
  });
});
