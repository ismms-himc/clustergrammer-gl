import { select } from "d3-selection";
import * as _ from "underscore";
import { getHzomeGeneInfo } from "./getHzomeGeneInfo";
import make_dendro_tooltip from "./makeDendroTooltip";

export default (function makeTooltipText(
  regl,
  store,
  catArgsManager,
  camerasManager,
  tooltip_fun,
  mouseover
) {
  const state = store.getState();

  let inst_axis;
  let tooltip_text;
  if (state.tooltip.tooltip_type === "matrix-cell") {
    // Matrix-Cell Tooltip
    // //////////////////////
    // row name
    tooltip_text = mouseover.row.name;
    tooltip_text = tooltip_text + " and ";
    // col name
    tooltip_text = tooltip_text + mouseover.col.name;
    tooltip_text = tooltip_text + " <br>Value: " + mouseover.value.toFixed(3);
    if ("value_iz" in state.interaction.mouseover) {
      tooltip_text =
        tooltip_text + " <br>Original value: " + mouseover.value_iz.toFixed(3);
    }
    tooltip_fun.show("tooltip");
    select(state.tooltip.tooltip_id)
      .style("text-align", "left")
      .html(tooltip_text);
  } else if (state.tooltip?.tooltip_type.indexOf("-label") > 0) {
    // Label Tooltip
    // ////////////////
    inst_axis = state.tooltip?.tooltip_type.split("-")[0];
    tooltip_text = mouseover[inst_axis].name;
    _.each(mouseover[inst_axis].cats, function (inst_cat) {
      tooltip_text = tooltip_text + "<br>" + inst_cat;
    });
    tooltip_fun.show("tooltip");
    select(state.tooltip.tooltip_id)
      .style("text-align", "left")
      .html(tooltip_text);
    if (state.tooltip.use_hzome === true) {
      getHzomeGeneInfo(store, mouseover[inst_axis].name);
    }
  } else if (state.tooltip?.tooltip_type.indexOf("-dendro") > 0) {
    // Dendro Tooltip
    // ////////////////
    inst_axis = state.tooltip.tooltip_type.split("-")[0];
    make_dendro_tooltip(
      regl,
      store,
      catArgsManager,
      camerasManager,
      tooltip_fun,
      mouseover,
      inst_axis
    );
  } else if (state.tooltip?.tooltip_type.indexOf("-cat-") > 0) {
    // Category Tooltip
    // ///////////////////
    inst_axis = state.tooltip.tooltip_type.split("-")[0];
    const inst_index = state.tooltip.tooltip_type.split("-")[2];
    tooltip_text = mouseover[inst_axis].cats[inst_index];
    tooltip_fun.show("tooltip");
    select(state.tooltip.tooltip_id)
      .style("text-align", "left")
      .html(tooltip_text);
  }
});
