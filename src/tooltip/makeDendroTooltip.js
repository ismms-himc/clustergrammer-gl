import * as d3 from "d3";
import calc_cat_cluster_breakdown from "../cats/calcCatClusterBreakdown";
import make_cat_breakdown_graph from "../cats/makeCatBreakdownGraph";
import manual_category_from_dendro from "./manualCategoryFromDendro";
import run_hide_tooltip from "./runHideTooltip";
export default (function make_dendro_tooltip(cgm, external_model, inst_axis) {
  const params = cgm.params;
  const mouseover = params.int.mouseover;
  params.tooltip_fun.show("tooltip");
  d3.select(params.tooltip_id)
    .append("div")
    .style("height", "16px")
    .style("text-align", "right")
    .style("cursor", "default")
    .on("click", function () {
      params.tooltip.permanent_tooltip = false;
      run_hide_tooltip(params);
    })
    .append("text")
    .text("x")
    .style("font-size", "15px");
  const cat_breakdown = calc_cat_cluster_breakdown(
    params,
    mouseover[inst_axis].dendro,
    inst_axis
  );
  make_cat_breakdown_graph(params, mouseover[inst_axis].dendro, cat_breakdown);
  // title for selected rows input box
  d3.select(params.tooltip_id)
    .append("text")
    .style("display", "inline-block")
    .style("cursor", "default")
    .text(
      "Selected " +
        inst_axis.replace("row", "Rows").replace("col", "Columns") +
        ": "
    );
  // selected output formats
  selected_label_container = d3
    .select(params.tooltip_id)
    .append("div")
    .style("display", "inline-block")
    .classed("selected_label_container", true);
  function make_output_string() {
    let label_string;
    if (params.dendro.output_label_format === "list") {
      label_string =
        "[" +
        params.dendro.selected_clust_names.map((x) => ` '${x}'`).join(",") +
        "]";
    } else if (params.dendro.output_label_format === "tsv") {
      label_string = params.dendro.selected_clust_names.join("\t");
    } else if (params.dendro.output_label_format === "csv") {
      label_string = params.dendro.selected_clust_names.join(", ");
    } else if (params.dendro.output_label_format === "new-line") {
      label_string = params.dendro.selected_clust_names.join("<br/>");
    }
    return label_string;
  }
  const selected_color = "#0198E1";
  const format_options = ["list", "csv", "tsv"];
  selected_label_container
    .selectAll("text")
    .data(format_options)
    .enter()
    .append("text")
    .classed("output_format", true)
    .style("margin-left", "2px")
    .style("display", "inline-block")
    .style("cursor", "default")
    .on("click", (d) => {
      params.dendro.output_label_format = d;
      d3.selectAll(
        params.tooltip_id + " .selected_label_container .output_format"
      ).style("color", (d) => {
        let inst_color = "white";
        if (d === params.dendro.output_label_format) {
          inst_color = selected_color;
        }
        return inst_color;
      });
      d3.select(params.tooltip_id + " input").attr("value", make_output_string);
    })
    .text((d, i) => {
      let inst_text = "";
      if (i < format_options.length - 1) {
        inst_text = d + ", ";
      } else {
        inst_text = d;
      }
      return inst_text;
    })
    .style("color", (d) => {
      let inst_color = "white";
      if (d === params.dendro.output_label_format) {
        inst_color = selected_color;
      }
      return inst_color;
    });
  d3.select(params.tooltip_id)
    .append("input")
    .attr("value", make_output_string)
    .style("width", "364px")
    .style("display", "block")
    .style("color", "black");
  if (params.cat_data.manual_category[inst_axis]) {
    manual_category_from_dendro(cgm, external_model, inst_axis);
  }
});
