import custom_label_reorder from "../reorders/customLabelReorder";

export default (function double_clicking(
  regl,
  state,
  dispatch,
  catArgsManager,
  mouseover
) {
  // params.tooltip.tooltip_type
  if (state.tooltip.tooltip_type === "col-label") {
    custom_label_reorder(
      regl,
      state,
      dispatch,
      catArgsManager,
      mouseover,
      "col"
    );
  }
  if (state.tooltip.tooltip_type === "row-label") {
    custom_label_reorder(
      regl,
      state,
      dispatch,
      catArgsManager,
      mouseover,
      "row"
    );
  }
});
