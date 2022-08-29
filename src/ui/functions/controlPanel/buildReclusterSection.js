// TODO: fix invalid this usage
import * as d3 from "d3";
import draw_webgl_layers from "../../../draws/drawWebglLayers.js";
import recluster from "../../../recluster/recluster.js";
import { mutateCatVizState } from "../../../state/reducers/catVizSlice.js";
import { mutateMatrixState } from "../../../state/reducers/matrixSlice.js";
import { mutateNetworkState } from "../../../state/reducers/networkSlice.js";

export default (function build_recluster_section(
  regl,
  store,
  catArgsManager,
  camerasManager
) {
  const state = store.getState();
  const dispatch = store.dispatch;

  const y_offset_buttons = 47;
  const cracker_room = 65;
  const button_dim = {};
  button_dim.height = 32;
  button_dim.width = 63;
  button_dim.buffer = 12;
  button_dim.x_trans = button_dim.width + button_dim.buffer;
  button_dim.fs = 11;
  const control_panel_color = "white";
  const text_color = "#47515b";
  const button_color = "#eee";
  const active_run_color = "#00FF75";
  const active_button_color = "#008000";
  const control_svg = d3.select(
    state.visualization.rootElementId + " .control-container svg"
  );
  control_svg
    .append("g")
    .classed("panel_button_titles", true)
    .classed("recluster_button_title", true)
    .on("click", function () {
      const clickState = store.getState();
      d3.selectAll(
        clickState.visualization.rootElementId + " .panel_button_titles"
      ).attr("opacity", 0.5);
      d3.select(this).attr("opacity", 1.0);
      if (clickState.cat_viz.current_panel === "reorder") {
        // modify buttons
        d3.select(
          clickState.visualization.rootElementId + " .panel_button_title"
        ).text("recluster".toUpperCase());
        d3.select(
          clickState.visualization.rootElementId + " .top_button_title"
        ).text("DIST");
        d3.select(
          clickState.visualization.rootElementId + " .bottom_button_title"
        ).text("LINK");
        d3.selectAll(
          clickState.visualization.rootElementId + " .reorder_buttons"
        ).style("display", "none");
        d3.select(
          clickState.visualization.rootElementId + " .run_cluster_container"
        ).style("display", "block");
        d3.selectAll(
          clickState.visualization.rootElementId + " .dist_options"
        ).style("display", "block");
        d3.selectAll(
          clickState.visualization.rootElementId + " .link_options_container"
        ).style("display", "block");
        dispatch(
          mutateCatVizState({
            current_panel: "recluster",
          })
        );
      }
    })
    .attr("transform", function () {
      const x_offset = 200 + cracker_room;
      const y_trans = y_offset_buttons - 2 * button_dim.buffer + 2;
      return "translate( " + x_offset + ", " + y_trans + ")";
    })
    .attr("opacity", 0.5)
    .append("text")
    .text("recluster".toUpperCase())
    .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr("font-weight", 400)
    .attr("font-size", button_dim.fs)
    .attr("text-anchor", "middle")
    .attr("stroke", text_color)
    .attr("alignment-baseline", "middle")
    .attr("letter-spacing", "2px")
    .attr("cursor", "default");
  const run_cluster_container = d3
    .select(state.visualization.rootElementId + " .control_svg")
    .append("g")
    .classed("run_cluster_container", true)
    .attr("transform", "translate(" + 350 + ", " + 91 + ")")
    .on("click", function () {
      if (
        state.matrix.potential_recluster.distance_metric !==
          state.matrix.distance_metric ||
        state.matrix.potential_recluster.linkage_type !==
          state.matrix.linkage_type
      ) {
        // transfer parameters to state when update is pressed
        dispatch(
          mutateMatrixState({
            distance_metric: state.matrix.potential_recluster.distance_metric,
            linkage_type: state.matrix.potential_recluster.linkage_type,
          })
        );
        recluster(
          regl,
          store,
          catArgsManager,
          camerasManager,
          state.matrix.potential_recluster.distance_metric,
          state.matrix.potential_recluster.linkage_type
        );
      }
    })
    .style("display", "none");
  run_cluster_container
    .append("rect")
    .style("height", button_dim.height)
    .style("width", button_dim.width)
    .style("fill", control_panel_color)
    .style("rx", 10)
    .style("ry", 10)
    .style("stroke", active_run_color)
    .style("stroke-width", 2.5);

  // run button (causes the reclustering)
  run_cluster_container
    .append("text")
    .classed("button-name", true)
    .text("run".toUpperCase())
    .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style("font-weight", 400)
    .style("font-size", button_dim.fs)
    .style("text-anchor", "middle")
    .style("stroke", text_color)
    .style("alignment-baseline", "middle")
    .style("letter-spacing", "2px")
    .style("cursor", "default")
    // .style('-webkit-user-select', 'none')
    .attr(
      "transform",
      "translate(" + button_dim.width / 2 + ", " + button_dim.height / 2 + ")"
    );
  // /////////////////////////
  // Recluster Options
  // /////////////////////////
  let dist_options = [
    {
      short: "cos",
      full: "cosine",
    },
    {
      short: "corr",
      full: "correlation",
    },
    {
      short: "eucl",
      full: "euclidean",
    },
  ];
  const dist_dict = {};
  dist_dict["cosine"] = "cos";
  dist_dict["correlation"] = "corr";
  dist_dict["euclidean"] = "eucl";
  const shift_x_order_buttons = 65 + cracker_room;
  const y_offset_top = 47;
  const y_offset_bottom = 91;
  // Distance Options Container
  // //////////////////////////////
  dist_options = d3
    .select(state.visualization.rootElementId + " .control_svg")
    .append("g")
    .classed("dist_option_container", true)
    .selectAll("g")
    .data(dist_options)
    .enter()
    .append("g")
    .classed("dist_options", true)
    .attr("transform", function (d, i) {
      const x_offset = button_dim.x_trans * i + shift_x_order_buttons;
      return "translate(" + x_offset + ", " + y_offset_top + ")";
    })
    .on("click", function (d) {
      dispatch(
        mutateMatrixState({
          potential_recluster: {
            distance_metric: d.full,
          },
        })
      );
      d3.select(state.visualization.rootElementId + " .dist_option_container")
        .selectAll("rect")
        .attr("stroke", button_color);
      d3.select(this).select("rect").attr("stroke", active_button_color);
    })
    .style("display", "none");
  dist_options
    .append("rect")
    .style("height", button_dim.height)
    .style("width", button_dim.width)
    .style("fill", control_panel_color)
    .style("rx", 10)
    .style("ry", 10)
    .attr("stroke", function (d) {
      let i_color;
      if (dist_dict[state.matrix.distance_metric] === d.short) {
        i_color = active_button_color;
      } else {
        i_color = button_color;
      }
      return i_color;
    })
    .style("stroke-width", 2.5);
  dist_options
    .append("text")
    .classed("button-name", true)
    .text((d) => d.short.toUpperCase())
    .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style("font-weight", 400)
    .style("font-size", button_dim.fs)
    .style("text-anchor", "middle")
    .style("stroke", text_color)
    .style("alignment-baseline", "middle")
    .style("letter-spacing", "2px")
    .style("cursor", "default")
    .style("-webkit-user-select", "none")
    .attr(
      "transform",
      "translate(" + button_dim.width / 2 + ", " + button_dim.height / 2 + ")"
    );
  // Linkage Options Container
  // //////////////////////////////
  const link_options = [
    {
      short: "avg",
      full: "average",
    },
    {
      short: "single",
      full: "single",
    },
    {
      short: "cmplt",
      full: "complete",
    },
  ];
  const link_dict = {};
  link_dict["average"] = "avg";
  link_dict["single"] = "single";
  link_dict["complete"] = "cmplt";
  const link_options_container = d3
    .select(state.visualization.rootElementId + " .control_svg")
    .append("g")
    .classed("link_option_container", true)
    .selectAll("g")
    .data(link_options)
    .enter()
    .append("g")
    .classed("link_options_container", true)
    .attr("transform", function (d, i) {
      const x_offset = button_dim.x_trans * i + shift_x_order_buttons;
      return "translate(" + x_offset + ", " + y_offset_bottom + ")";
    })
    .on("click", function (d) {
      dispatch(
        mutateMatrixState({
          potential_recluster: {
            linkage_type: d.full,
          },
        })
      );
      d3.select(state.visualization.rootElementId + " .link_option_container")
        .selectAll("rect")
        .attr("stroke", button_color);
      d3.select(this).select("rect").attr("stroke", active_button_color);
    })
    .style("display", "none");
  link_options_container
    .append("rect")
    .style("height", button_dim.height)
    .style("width", button_dim.width)
    .style("fill", control_panel_color)
    .style("rx", 10)
    .style("ry", 10)
    .attr("stroke", function (d) {
      let i_color;
      if (link_dict[state.matrix.linkage_type] === d.short) {
        i_color = active_button_color;
      } else {
        i_color = button_color;
      }
      return i_color;
    })
    .style("stroke-width", 2.5);
  link_options_container
    .append("text")
    .classed("button-name", true)
    .text((d) => d.short.toUpperCase())
    .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .style("font-weight", 400)
    .style("font-size", button_dim.fs)
    .style("text-anchor", "middle")
    .style("stroke", text_color)
    .style("alignment-baseline", "middle")
    .style("letter-spacing", "2px")
    .style("cursor", "default")
    .style("-webkit-user-select", "none")
    .attr(
      "transform",
      "translate(" + button_dim.width / 2 + ", " + button_dim.height / 2 + ")"
    );
  // Normalize Section
  // /////////////////////////////////////////////
  if (state.network.norm.initial_status === "zscored") {
    control_svg
      .append("g")
      .classed("panel_button_titles", true)
      .classed("normalize_button_title", true)
      .on("click", function () {
        let norm_zscore_status;
        if (state.network.norm.zscore_status === "non-zscored") {
          norm_zscore_status = "zscored";
          d3.select(this).select("text").text("z-scored".toUpperCase());
        } else {
          norm_zscore_status = "non-zscored";
          d3.select(this).select("text").text("raw".toUpperCase());
        }
        dispatch(
          mutateNetworkState({
            norm: {
              zscore_status: norm_zscore_status,
            },
          })
        );
        draw_webgl_layers(regl, store, catArgsManager, camerasManager);
      })
      .attr("transform", function () {
        const x_offset = 290 + cracker_room;
        const y_trans = y_offset_buttons - 2 * button_dim.buffer + 2;
        return "translate( " + x_offset + ", " + y_trans + ")";
      })
      .attr("opacity", 1.0)
      .append("text")
      .text("z-scored".toUpperCase())
      .attr("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .attr("font-weight", 400)
      .attr("font-size", button_dim.fs)
      .attr("text-anchor", "middle")
      .attr("stroke", text_color)
      .attr("alignment-baseline", "middle")
      .attr("letter-spacing", "2px")
      .attr("cursor", "default");
  }
});
