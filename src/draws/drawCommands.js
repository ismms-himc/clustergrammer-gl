import { mutateInteractionState } from "../state/reducers/interaction/interactionSlice";
import { mutateLabelsState } from "../state/reducers/labels/labelsSlice";
import draw_webgl_layers from "./drawWebglLayers";

export default (function drawCommands(
  regl,
  store,
  catArgsManager,
  camerasManager
) {
  const state = store.getState();
  const dispatch = store.dispatch;

  // if mousing over categories initialize all categories to low opacity
  let mousing_over_cat = false;
  if (state.tooltip.tooltip_type) {
    if (state.tooltip.tooltip_type.includes("-cat-")) {
      // This is required to updated category opacity when mousing over
      catArgsManager.regenerateCatArgsArrs(store);
      dispatch(
        mutateInteractionState({
          need_reset_cat_opacity: true,
        })
      );
      mousing_over_cat = true;
    }
  }
  if (
    store.getState().interaction.need_reset_cat_opacity &&
    mousing_over_cat === false
  ) {
    catArgsManager.regenerateCatArgsArrs(store);
    dispatch(
      mutateInteractionState({
        need_reset_cat_opacity: false,
      })
    );
  }
  draw_webgl_layers(regl, store, catArgsManager, camerasManager);
  if (state.labels.draw_labels) {
    dispatch(
      mutateLabelsState({
        draw_labels: false,
      })
    );
  }
});
