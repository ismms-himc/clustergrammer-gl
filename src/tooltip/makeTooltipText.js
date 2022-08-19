import * as d3 from "d3";
import * as _ from "underscore";
import make_dendro_tooltip from "./makeDendroTooltip";

export default (function make_tooltip_text(
  regl,
  params,
  mouseover,
  external_model
) {
  let inst_axis;
  let tooltip_text;
  if (params.tooltip.tooltip_type === "matrix-cell") {
    // Matrix-Cell Tooltip
    // //////////////////////
    // row name
    tooltip_text = mouseover.row.name;
    tooltip_text = tooltip_text + " and ";
    // col name
    tooltip_text = tooltip_text + mouseover.col.name;
    tooltip_text = tooltip_text + " <br>Value: " + mouseover.value.toFixed(3);
    if ("value_iz" in params.int.mouseover) {
      tooltip_text =
        tooltip_text + " <br>Original value: " + mouseover.value_iz.toFixed(3);
    }
    params.tooltip_fun.show("tooltip");
    d3.select(params.tooltip_id).style("text-align", "left").html(tooltip_text);
  } else if (params.tooltip.tooltip_type.indexOf("-label") > 0) {
    // Label Tooltip
    // ////////////////
    inst_axis = params.tooltip.tooltip_type.split("-")[0];
    tooltip_text = mouseover[inst_axis].name;
    _.each(mouseover[inst_axis].cats, function (inst_cat) {
      tooltip_text = tooltip_text + "<br>" + inst_cat;
    });
    params.tooltip_fun.show("tooltip");
    d3.select(params.tooltip_id).style("text-align", "left").html(tooltip_text);
    if (params.use_hzome === true) {
      params.hzome.gene_info(mouseover[inst_axis].name);
    }
  } else if (params.tooltip.tooltip_type.indexOf("-dendro") > 0) {
    // Dendro Tooltip
    // ////////////////
    inst_axis = params.tooltip.tooltip_type.split("-")[0];
    make_dendro_tooltip(regl, params, mouseover, external_model, inst_axis);
  } else if (params.tooltip.tooltip_type.indexOf("-cat-") > 0) {
    // Category Tooltip
    // ///////////////////
    inst_axis = params.tooltip.tooltip_type.split("-")[0];
    const inst_index = params.tooltip.tooltip_type.split("-")[2];
    tooltip_text = mouseover[inst_axis].cats[inst_index];
    params.tooltip_fun.show("tooltip");
    d3.select(params.tooltip_id).style("text-align", "left").html(tooltip_text);
  }
});
