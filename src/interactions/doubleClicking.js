import custom_label_reorder from "../reorders/customLabelReorder";

export default (function doubleClicking(
  regl,
  store,
  catArgsManager,
  camerasManager,
  mouseover
) {
  const state = store.getState();
  if (state.tooltip.tooltip_type === "col-label") {
    custom_label_reorder(
      regl,
      store,
      catArgsManager,
      camerasManager,
      mouseover,
      "col"
    );
  } else if (state.tooltip.tooltip_type === "row-label") {
    custom_label_reorder(
      regl,
      store,
      catArgsManager,
      camerasManager,
      mouseover,
      "row"
    );
  }
});
