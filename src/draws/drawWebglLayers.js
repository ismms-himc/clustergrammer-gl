import make_matrix_args from "../matrixCells/makeMatrixArgs";
import drawAxisComponents from "./drawAxisComponents";
import drawMatrixComponents from "./drawMatrixComponents";
import drawStaticComponents from "./drawStaticComponents";

export default function draw_webgl_layers(
  regl,
  state,
  catArgsManager,
  cameras
) {
  const reglProps = make_matrix_args(regl, state);
  drawMatrixComponents(regl, state, cameras, reglProps);
  const draw_labels = state.labels.draw_labels;
  drawAxisComponents(regl, state, catArgsManager, "row", draw_labels);
  drawAxisComponents(regl, state, catArgsManager, "col", draw_labels);
  drawStaticComponents(regl, state, cameras);
}
