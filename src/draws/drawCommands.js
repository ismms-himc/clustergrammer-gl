import { mutateLabelsState } from "../state/reducers/labels/labelsSlice";
import draw_webgl_layers from "./drawWebglLayers";

export default (function drawCommands(
  regl,
  state,
  dispatch,
  catArgsManager,
  cameras
) {
  // if mousing over categories initialize all categories to low opacity
  let mousing_over_cat = false;
  let need_reset_cat_opacity;
  if (state.tooltip.tooltip_type) {
    if (state.tooltip.tooltip_type.includes("-cat-")) {
      // This is required to updated category opacity when mousing over
      catArgsManager.regenerateCatArgsArrs(state);
      need_reset_cat_opacity = true;
      mousing_over_cat = true;
    }
  }
  if (state.interaction.need_reset_cat_opacity && mousing_over_cat === false) {
    catArgsManager.regenerateCatArgsArrs(state);
    need_reset_cat_opacity = false;
  }
  draw_webgl_layers(regl, state, catArgsManager, cameras);
  if (state.labels.draw_labels) {
    dispatch(
      mutateLabelsState({
        draw_labels: false,
      })
    );
  }

  return { need_reset_cat_opacity };
});
