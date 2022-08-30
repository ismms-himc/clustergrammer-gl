import { select, selectAll } from "d3-selection";
import calcCatClusterBreakdown from "../cats/functions/calcCatClusterBreakdown";
import makeCatBreakdownGraph from "../cats/functions/makeCatBreakdownGraph";
import { mutateDendrogramState } from "../state/reducers/dendrogramSlice";
import manual_category_from_dendro from "./manualCategoryFromDendro";

export default (function make_dendro_tooltip(
  regl,
  store,
  catArgsManager,
  camerasManager,
  tooltip_fun,
  mouseover,
  inst_axis
) {
  const { dendro, tooltip, cat_data } = store.getState();
  const dispatch = store.dispatch;

  tooltip_fun.show("tooltip");
  select(tooltip.tooltip_id)
    .append("div")
    .style("height", "16px")
    .style("text-align", "right")
    .style("cursor", "default")
    .on("click", function () {
      // TODO: permanent tooltip when hovering dendrogram?
      // dispatch(
      //   mutateTooltipState({
      //     permanent_tooltip: false,
      //   })
      // );
      // run_hide_tooltip(store, tooltip_fun);
    })
    .append("text")
    .text("x")
    .style("font-size", "15px");
  const { cb: cat_breakdown, selected_clust_names } = calcCatClusterBreakdown(
    store,
    mouseover[inst_axis].dendro,
    inst_axis
  );
  makeCatBreakdownGraph(store, mouseover[inst_axis].dendro, cat_breakdown);

  // title for selected rows input box
  select(tooltip.tooltip_id)
    .append("text")
    .style("display", "inline-block")
    .style("cursor", "default")
    .text(
      "Selected " +
        inst_axis.replace("row", "Rows").replace("col", "Columns") +
        ": "
    );
  // selected output formats
  const selected_label_container = select(tooltip.tooltip_id)
    .append("div")
    .style("display", "inline-block")
    .classed("selected_label_container", true);
  function make_output_string() {
    let label_string;
    if (dendro.output_label_format === "list") {
      label_string =
        "[" + selected_clust_names.map((x) => ` '${x}'`).join(",") + "]";
    } else if (dendro.output_label_format === "tsv") {
      label_string = selected_clust_names.join("\t");
    } else if (dendro.output_label_format === "csv") {
      label_string = selected_clust_names.join(", ");
    } else if (dendro.output_label_format === "new-line") {
      label_string = selected_clust_names.join("<br/>");
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
      const state = store.getState();
      dispatch(mutateDendrogramState({ output_label_format: d }));
      selectAll(
        state.tooltip.tooltip_id + " .selected_label_container .output_format"
      ).style("color", (d) => {
        let inst_color = "white";
        if (d === state.dendro.output_label_format) {
          inst_color = selected_color;
        }
        return inst_color;
      });
      select(state.tooltip.tooltip_id + " input").attr(
        "value",
        make_output_string
      );
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
      if (d === dendro.output_label_format) {
        inst_color = selected_color;
      }
      return inst_color;
    });
  select(tooltip.tooltip_id)
    .append("input")
    .attr("value", make_output_string)
    .style("width", "364px")
    .style("display", "block")
    .style("color", "black");
  if (cat_data.manual_category[inst_axis]) {
    manual_category_from_dendro(
      regl,
      store,
      catArgsManager,
      camerasManager,
      selected_clust_names,
      inst_axis
    );
  }
});
