import { select } from "d3-selection";
import runReorder from "../../reorders/runReorder";
import { mutateNetworkState } from "../../state/reducers/networkSlice";
import { mutateOrderState } from "../../state/reducers/order/orderSlice";

export default (function buildReorderCatTitles(
  regl,
  store,
  catArgsManager,
  camerasManager
) {
  const state = store.getState();
  const dispatch = store.dispatch;
  const button_color = "#eee";
  const fieldSorter = (fields) => (a, b) =>
    fields
      .map((o) => {
        let dir = 1;
        if (o[0] === "-") {
          dir = -1;
          o = o.substring(1);
        }
        return a[o] > b[o] ? dir : a[o] < b[o] ? -dir : 0;
      })
      .reduce((p, n) => (p ? p : n), 0);
  function stable_reorder_cats(axis, i) {
    const reorderState = store.getState();
    const inst_nodes = reorderState.network[axis + "_nodes"].map((x) => x);
    const cat_primary = "cat-" + String(i);
    const cat_secondary_up = "cat-" + String(i - 1);
    const cat_secondary_down = "cat-" + String(i + 1);
    let cat_secondary;
    if (cat_secondary_down in reorderState.network[axis + "_nodes"][0]) {
      cat_secondary = cat_secondary_down;
    } else if (cat_secondary_up in reorderState.network[axis + "_nodes"][0]) {
      cat_secondary = cat_secondary_up;
    } else {
      // single category reordering
      cat_secondary = cat_primary;
    }
    const sorted_nodes = inst_nodes.sort(
      fieldSorter([cat_primary, cat_secondary])
    );
    const order_dict = {};
    let inst_name;
    sorted_nodes.forEach((d, i) => {
      inst_name = d.name;
      if (inst_name.includes(": ")) {
        inst_name = inst_name.split(": ")[1];
      }
      order_dict[inst_name] = i;
    });
    dispatch(
      mutateNetworkState({
        [`${axis}_nodes`]: inst_nodes.map((d) => {
          inst_name = d.name;
          if (inst_name.includes(": ")) {
            inst_name = inst_name.split(": ")[1];
          }
          d.custom = order_dict[inst_name];
          return d;
        }),
      })
    );
    catArgsManager.regenerateCatArgsArrs(regl, store);
    runReorder(regl, store, catArgsManager, camerasManager, axis, "custom");
    dispatch(
      mutateOrderState({
        inst: {
          col: "custom",
        },
      })
    );
  }
  // Column Titles
  let pos_x = 845;
  let pos_y = 125;
  const col_cat_title_group = select(
    state.visualization.rootElementId + " .canvas-container"
  )
    .append("g")
    .style("position", "absolute")
    .style("top", pos_y + "px")
    .style("left", pos_x + "px")
    .classed("col-cat-title-group", true);
  const dim_x = 55;
  const dim_y = 10;
  const col_cat_title_svg = col_cat_title_group
    .append("svg")
    .style("height", function () {
      const svg_height = dim_y * state.cat_data.col.length + 5;
      return svg_height + "px";
    })
    .style("width", dim_x + "px")
    .classed("col-cat-title-svg", true);
  const col_cat_reorder_group = col_cat_title_svg
    .append("g")
    .classed("col-cat-reorder-group", true);
  col_cat_reorder_group
    .selectAll("rect")
    .data(state.cat_data.col)
    .enter()
    .append("text")
    .text(function (d) {
      return d.cat_title;
    })
    .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style("font-weight", 800)
    .style("font-size", 12)
    .attr("transform", function (d, i) {
      const y_trans = (dim_y + 1) * i + 10;
      return "translate( 0, " + y_trans + ")";
    });
  col_cat_reorder_group
    .selectAll("rect")
    .data(state.cat_data.col)
    .enter()
    .append("rect")
    .style("width", dim_x + "px")
    .style("height", function () {
      const rect_height = dim_y + 2;
      return rect_height + "px";
    })
    .style("fill", "white")
    .style("opacity", 0.0)
    .on("dblclick", function (d, i) {
      stable_reorder_cats("col", i);
      dispatch(
        mutateOrderState({
          inst: {
            col: "custom",
          },
        })
      );
      select(state.visualization.rootElementId + " .col-reorder-buttons")
        .selectAll("rect")
        .attr("stroke", button_color);
    })
    .attr("transform", function (d, i) {
      const y_trans = (dim_y + 2) * i;
      return "translate( 0, " + y_trans + ")";
    })
    .style("user-select", "none");
  // Row Titles
  pos_x = 125;
  // var pos_y = 98; // 60 with no cats, 72 with one cat, 85 with two cats
  pos_y = 62 + 12 * state.cat_data.col.length;
  const row_cat_title_group = select(
    state.visualization.rootElementId + " .canvas-container"
  )
    .append("g")
    .style("position", "absolute")
    .style("top", pos_y + "px")
    .style("left", pos_x + "px")
    .classed("row-cat-title-group", true);
  const row_dim_x = 60;
  const row_dim_y = 10;
  const row_cat_title_svg = row_cat_title_group
    .append("svg")
    .style("width", function () {
      const svg_height = row_dim_y * state.cat_data.row.length + 5;
      return svg_height + "px";
    })
    .style("height", row_dim_x + "px")
    .classed("row-cat-title-svg", true);
  let inst_rotate;
  const row_cat_reorder_group = row_cat_title_svg
    .append("g")
    .classed("row-cat-reorder-group", true)
    .attr("transform", function () {
      inst_rotate = -90;
      return "translate(0," + row_dim_x + "), rotate(" + inst_rotate + ")";
    });
  row_cat_reorder_group
    .selectAll("rect")
    .data(state.cat_data.row)
    .enter()
    .append("text")
    .text(function (d) {
      return d.cat_title;
    })
    .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style("font-weight", 800)
    .style("font-size", 12)
    .attr("transform", function (d, i) {
      const y_trans = (row_dim_y + 1) * i + 10;
      return "translate( 0, " + y_trans + ")";
    });
  row_cat_reorder_group
    .selectAll("rect")
    .data(state.cat_data.row)
    .enter()
    .append("rect")
    .style("width", row_dim_x + "px")
    .style("height", function () {
      const rect_height = row_dim_y + 2;
      return rect_height + "px";
    })
    .style("fill", "white")
    .style("opacity", 0.0)
    .on("dblclick", function (d, i) {
      stable_reorder_cats("row", i);
      dispatch(
        mutateOrderState({
          inst: {
            row: "custom",
          },
        })
      );
      select(state.visualization.rootElementId + " .row-reorder-buttons")
        .selectAll("rect")
        .attr("stroke", button_color);
    })
    .attr("transform", function (d, i) {
      const y_trans = (row_dim_y + 2) * i;
      return "translate( 0, " + y_trans + ")";
    })
    .style("user-select", "none");
});
