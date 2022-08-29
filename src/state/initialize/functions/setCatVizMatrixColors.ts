import { Store } from "@reduxjs/toolkit";
import colorToRgba from "../../../colors/colorToRgba";
import { MatColors, mutateCatVizState } from "../../reducers/catVizSlice";
import { RootState } from "../../store/store";

const MAT_COLORS: MatColors = {
  pos_rgb: [1, 0, 0],
  neg_rgb: [0, 0, 1],
};

export default function setCatVizMatrixColors(store: Store<RootState>) {
  const { network } = store.getState();
  if ("matrix_colors" in network) {
    const pos_color = network?.matrix_colors?.pos;
    const neg_color = network?.matrix_colors?.neg;
    MAT_COLORS.pos_rgb = colorToRgba(pos_color).slice(0, 3);
    MAT_COLORS.neg_rgb = colorToRgba(neg_color).slice(0, 3);
  }
  store.dispatch(
    mutateCatVizState({
      mat_colors: MAT_COLORS,
    })
  );
}
