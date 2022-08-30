import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import * as _ from "underscore";
import catBreakdownBars from "./catBreakdownBars";
import catBreakdownValues from "./catBreakdownValues";

export default (function makeCatBreakdownGraph(store, dendro_info, cb) {
  const state = store.getState();

  if (cb.length > 0) {
    let width = 370;
    const bar_offset = state.cat_viz.cat_bar_height + 2;
    // these are the indexes where the number-of-nodes and the number of downsampled
    // nodes are stored
    const num_nodes_index = 4;
    const num_nodes_ds_index = 5;
    let is_downsampled = false;
    if (cb[0].bar_data[0][num_nodes_ds_index] !== null) {
      width = width + 100;
      is_downsampled = true;
    }
    // the index that will be used to generate the bars (will be different if
    // downsampled)
    let cluster_total = dendro_info.all_names.length;
    let bars_index = num_nodes_index;
    if (is_downsampled) {
      bars_index = num_nodes_ds_index;
      // calculate the total number of nodes in downsampled case
      const i_bar_data = cb[0].bar_data;
      cluster_total = 0;
      _.each(i_bar_data, function (tmp_data) {
        cluster_total = cluster_total + tmp_data[num_nodes_ds_index];
      });
    }
    // limit on the number of category types shown
    const max_cats = 4;
    // limit the number of bars shown
    const max_bars = 10;
    // calculate height needed for svg based on cb data
    let svg_height = 10;
    const shift_down_height = 18;
    _.each(cb.slice(0, max_cats), function (tmp_break) {
      let num_bars = tmp_break.bar_data.length;
      if (num_bars > max_bars) {
        num_bars = max_bars;
      }
      svg_height = svg_height + shift_down_height * (num_bars + 1);
    });
    const main_dendro_svg = select(state.tooltip.tooltip_id)
      .append("div")
      .style("margin-top", "5px")
      .classed("cat_graph", true)
      .append("svg")
      .style("height", svg_height + "px")
      .style("width", width + "px");
    // make background
    main_dendro_svg
      .append("rect")
      .classed("cat_background", true)
      .attr("height", svg_height + "px")
      .attr("width", width + "px")
      .attr("fill", "white")
      .attr("opacity", 1);
    // limit the category-types
    cb = cb.slice(0, max_cats);
    // shift the position of the numbers based on the size of the number
    // offset the count column based on how large the counts are
    const digit_offset = scaleLinear().domain([0, 100000]).range([20, 30]);
    // the total amout to shift down the next category
    let shift_down = 15;
    _.each(cb, function (cat_data) {
      const max_bar_value = cat_data.bar_data[0][bars_index];
      // only keep the top max_bars categories
      cat_data.bar_data = cat_data.bar_data.slice(0, max_bars);
      const count_offset = digit_offset(max_bar_value);
      const cgg = main_dendro_svg
        .append("g")
        .classed("cgg", true)
        .attr("transform", "translate(10, " + shift_down + ")");
      const cat_bar_container = cgg
        .append("g")
        .classed("cat_bar_container", true)
        .attr("transform", "translate(0, 10)");
      // make bar groups (hold bar and text)
      const cat_bar_groups = cat_bar_container
        .selectAll("g")
        .data(cat_data.bar_data)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
          const i_y = i * bar_offset;
          return "translate(0," + i_y + ")";
        });
      catBreakdownBars(store, cat_data, cgg, bars_index, cat_bar_groups);
      catBreakdownValues(
        store,
        cgg,
        cat_bar_groups,
        num_nodes_index,
        is_downsampled,
        count_offset,
        bars_index,
        cluster_total
      );
      // shift down based on number of bars
      shift_down =
        shift_down + shift_down_height * (cat_data.bar_data.length + 1);
    });
  }
});
