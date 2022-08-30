import { scaleLinear } from "d3-scale";

export default (function cat_breakdown_bars(
  store,
  cat_data,
  cat_graph_group,
  bars_index,
  cat_bar_groups
) {
  const state = store.getState();

  const paragraph_string = "<p>";
  const super_string = ": ";
  const bar_width = state.cat_viz.cat_bar_width;
  const bar_height = state.cat_viz.cat_bar_height;
  const max_len = 25;
  const max_bar_value = cat_data.bar_data[0][bars_index];
  let i_title = cat_data.type_name;
  if (i_title.length >= max_len) {
    i_title = i_title.slice(0, max_len) + "..";
  }
  // make title
  cat_graph_group
    .append("text")
    .classed("cat_graph_title", true)
    .text(i_title)
    .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style("font-weight", 800);
  const line_y = 4;
  cat_graph_group
    .append("line")
    .attr("x1", 0)
    .attr("x2", bar_width)
    .attr("y1", line_y)
    .attr("y2", line_y)
    .attr("stroke", "blue")
    .attr("stroke-width", 1)
    .attr("opacity", 1.0);
  // bar length is max when all nodes in cluster are of
  // a single cat
  const bar_scale = scaleLinear()
    .domain([0, max_bar_value])
    .range([0, bar_width]);
  // make bars
  cat_bar_groups
    .append("rect")
    .attr("height", bar_height + "px")
    .attr("width", function (d) {
      const i_width = bar_scale(d[bars_index]);
      return i_width + "px";
    })
    .attr("fill", function (d) {
      // cat color is stored in the third element
      return d[3];
    })
    .attr("opacity", state.cat_viz.cat_colors.opacity)
    .attr("stroke", "grey")
    .attr("stroke-width", "0.5px");
  // make bar labels
  cat_bar_groups
    .append("text")
    .classed("bar_labels", true)
    .text(function (d) {
      let i_text = d[1];
      if (i_text.indexOf(super_string) > 0) {
        i_text = i_text.split(super_string)[1];
      }
      if (i_text.indexOf(paragraph_string) > 0) {
        // required for Enrichr category names (needs improvements)
        i_text = i_text.split(paragraph_string)[0];
      }
      // ensure that bar name is not too long
      if (i_text.length >= max_len) {
        i_text = i_text.slice(0, max_len) + "..";
      }
      return i_text;
    })
    .attr("transform", function () {
      return "translate(5, " + 0.75 * bar_height + ")";
    })
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("text-anchor", "right");
});
