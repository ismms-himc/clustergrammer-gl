import colorToRgba from "../colors/colorToRgba";
import { MatColors, mutateCatVizState } from "../state/reducers/catVizSlice";
import { AppDispatch, RootState } from "../state/store/store";

const MAT_COLORS: MatColors = {
  pos_rgb: [1, 0, 0],
  neg_rgb: [0, 0, 1],
};

export default function setCatVizMatrixColors(
  state: RootState,
  dispatch: AppDispatch
) {
  const { network } = state;
  if ("matrix_colors" in network) {
    const pos_color = network?.matrix_colors?.pos;
    const neg_color = network?.matrix_colors?.neg;
    MAT_COLORS.pos_rgb = colorToRgba(pos_color).slice(0, 3);
    MAT_COLORS.neg_rgb = colorToRgba(neg_color).slice(0, 3);
  }
  dispatch(
    mutateCatVizState({
      mat_colors: MAT_COLORS,
    })
  );
}
